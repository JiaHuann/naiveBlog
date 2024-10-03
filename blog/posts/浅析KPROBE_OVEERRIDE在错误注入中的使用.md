> Author: 刘佳欢(ByteIntern)
>部门: Data-SYS-STE-OS


## 0. 引言

近期工作刚好涉及到相关内容，首先想到的是：使用eBPF技术去拿到目标函数执行流，再进行override替换。笔者在此之前并不清楚该想法是否可行。毕竟劫持函数流，并替换掉返回值这样的行为应该是和`eBPF verifier`的初心是严重不匹配的。

但是抱着探索一番的态度，还是尝试性的打开了`bpf_helpers.h`去查看相关API。
![[Pasted image 20240822164817.png]]

令我意想不到的是，该方法竟然真的存在（而且似乎已经存在很久了）。以上便是下文的Motivation，下面会详细介绍该机制，但是首先还是明晰一下错误注入这个概念。



# 1.错误注入概念（大佬请跳过）

错误注入技术是一种重要的方法，用于模拟和评估系统在异常或故障条件下的行为。通过**故意引入错误**，开发者和测试人员可以验证系统的健壮性、可靠性和容错能力。错误注入技术广泛应用于各种软件系统，包括操作系统、数据库、网络协议栈等，以确保这些系统在面对实际运行中可能遇到的错误时，能够正确响应并保持稳定运行。

在Linux内核开发和测试中，错误注入技术同样扮演着关键角色。内核开发者需要一种有效的方法来模拟和测试内核在各种异常情况下的表现。KPROBE_OVERRIDE作为一种内核错误注入机制，提供了一种强大的工具，允许开发者在运行时动态地修改内核代码的行为，从而模拟各种错误条件。



# 2. 错误注入技术概述
1. **基于硬件的错误注入**
    - **例如**：使用故障注入器在特定硬件模块上引入电压波动、时钟故障等。
    - **优点**：能够精确模拟硬件故障，测试结果更接近真实环境。
    - **缺点**：成本高，需要专业设备，实施复杂，可能影响硬件寿命。

2. **基于用户态软件的错误注入**
    - **例如**：chaos-mesh,面向云原生场景的混沌工程，故障注入编排。
	    [Chaos Mesh 简介 | Chaos Mesh](https://chaos-mesh.org/zh/docs/)
	- **优点**：编排灵活，能够覆盖广泛的云原生应用场景，支持多种类型的故障注入，如网络延迟、CPU负载、内存耗尽等。
	- **缺点**：虽然功能强大，但主要针对云原生环境，对于非云原生应用的支持可能有限。此外，使用复杂度相对较高，需要一定的学习和配置成本。

3. **基于内核的错误注入**
	- **例如**：内核的`fault injection`特性。
		[Fault injection capabilities infrastructure — The Linux Kernel documentation](https://docs.kernel.org/fault-injection/fault-injection.html)
	- **优点**：直接在内核层面进行错误注入，能够精确模拟硬件故障和内核函数的异常行为，测试结果更接近真实环境。
	- **缺点**：需要对内核有一定的了解和操作权限，实施复杂，同时内核现有集成的注入点有限，使用逻辑也有限（比如需要错误出现的概率分布、错误类型等）。



# 3. KPROBE_OVERRIDE机制介绍
KPROBE_OVERIDE是基于内核`CONFIG_KPROBE_OVERRIDE`的功能，使用bpf_helpers中的`bpf_override_return()`函数进行实际的操作。

eBPF（Extended Berkeley Packet Filter）是一种强大的内核技术，最初设计用于网络数据包过滤，但现在已经扩展到多种用途，包括性能监控、安全监控、跟踪和错误注入等。eBPF 允许用户空间程序在内核中安全地执行受限的沙盒代码，而无需修改内核源码或加载内核模块。

关于eBPF是什么，以及eBPF的基本架构，不是本文的重点，可以参考：
	[eBPF基本概念-ByteTech](https://bytetech.info/articles/7275228385666678842?searchId=202408231120572A772C557E6B55DED6A7)

**重要的一点是**：
	BPF Helpers 是内核提供的一组函数，eBPF 程序可以调用这些函数来执行各种操作，如访问系统信息、操作数据包、与用户空间通信等。这些函数提供了 eBPF 程序与内核交互的接口。

## 3.1 bpf_helpers 中关于该API的描述：

> "Used for error injection, this helper uses kprobes to override the return value of the probed function, and to set it to *rc*. The first argument is the context *regs* on which the kprobe works."

1. 用于错误注入，此辅助函数使用 `kprobes` 来覆盖被探测函数的返回值，并将其设置为 *rc*。
第一个参数是被 kprobe 探测的上下文 *regs*。

> "This helper works by setting the PC (program counter) to an override function which is run in place of the original probed function. This means the probed function is not run at all. The replacement function just returns with the required  value."

2. 此辅助函数通过将 PC（程序计数器）设置为一个替代函数，该函数代替原始被探测函数运行。
这意味着被探测函数根本不会运行。替代函数只是返回所需的值。

> "This helper has security implications, and thus is subject to restrictions. It is only available if the kernel was compiled with the **CONFIG_BPF_KPROBE_OVERRIDE** configuration option, and in this case it only works on functions tagged with **ALLOW_ERROR_INJECTION** in the kernel code."

3. 此辅助函数具有安全影响，因此受到限制。只有在编译内核时启用了 **CONFIG_BPF_KPROBE_OVERRIDE** 配置选项，
并且在这种情况下，它仅适用于在内核代码中标记为 **ALLOW_ERROR_INJECTION** 的函数。

> "Also, the helper is only available for the architectures having the CONFIG_FUNCTION_ERROR_INJECTION option. As of this writing, x86 architecture is the only one to support this feature."

 4. 此外，该辅助函数仅适用于具有 CONFIG_FUNCTION_ERROR_INJECTION 选项的架构。截至目前，x86 架构是唯一支持此功能的架构。



## 3.2 **ALLOW_ERROR_INJECTION** 标记
使用KPROBE_OVERRIDE特性，仅支持白名单内的函数，白名单通过ALLOW_ERROR_INJECTION宏进行标记。


### 下面简单分析一下：
```c
//  include/asm-generic/error_injection.h
#define ALLOW_ERROR_INJECTION(fname, _etype)				\
static struct error_injection_entry __used				\
	__section("_error_injection_whitelist")			\
	_eil_addr_##fname = {						\
		.addr = (unsigned long)fname,				\
		.etype = EI_ETYPE_##_etype,				\
	};
```
- 这个宏用来记录被标记为白名单的内核函数。
- 针对每个被标记的函数创建一个静态的error_injection_entry类型结构体，存放在`_error_injection_whitelist`ELF段中，并用`__used`属性确保了即使该实例在未被引用的情况下也不会被编译器优化掉。
- 字段为 1.该函数的地址 2.支持的错误类型。


### 错误类型白名单设置
```c
//include/asm-generic/error_injection.h
enum { //错误类型 
	EI_ETYPE_NONE,		/* Dummy value for undefined case */
	EI_ETYPE_NULL,		/* Return NULL if failure */
	EI_ETYPE_ERRNO,		/* Return -ERRNO if failure */
	EI_ETYPE_ERRNO_NULL,	/* Return -ERRNO or NULL if failure */
	EI_ETYPE_TRUE,		/* Return true if failure */
};
```

- **EI_ETYPE_ERRNO**：如 `-EIO`、`-ENOMEM` 等，返回一个int错误码。
- **EI_ETYPE_ERRNO_NULL**：比上一个多了个NULL，针对一些在错误情况下需要返回NULL指针的函数。
- **EI_ETYPE_TRUE**：针对一些在错误情况下需要返回true/false的函数。

这三种可以满足大部分场景的使用了。
总结：当我们要针对一个函数进行标记的时候，需要清楚这个函数如果返回错误，这个错误应该是什么类型，根据需要传入、`ERRNO/TRUE/NONE/NULL`等即可。


## 3.3 CONFIG_BPF_KPROBE_OVERRIDE 依赖关系

The Linux kernel configuration item `CONFIG_BPF_KPROBE_OVERRIDE`:

- prompt: Enable BPF programs to override a kprobed function
- type: bool
- depends on: `CONFIG_BPF_EVENTS` and `CONFIG_FUNCTION_ERROR_INJECTION`
- defined in [kernel/trace/Kconfig](https://github.com/torvalds/linux/tree/master/kernel/trace/Kconfig)
- found in Linux kernels: 4.16–4.20, 5.0–5.19, 6.0–6.10, 6.11-rc+HEAD



# 4. KPROBE_OVERRIDE在内核错误注入中的具体应用
我们更关注的痛点，是不经常容易走到的错误处理分支，不同于其他高级语言的`try...catch`机制，内核代码往往比较繁琐、自由，同时也会带来风险和疏忽。但是KPROBE_OVEERIED不同于传统错误注入。

例如：
1. **硬件问题的难以模拟**：
    - 硬件问题（如硬件故障、信号干扰等）往往难以在测试环境中精确模拟。
    - 从硬件侧下手模拟这些错误情况通常成本高昂且复杂。

2. **内核代码的繁琐和自由**：
    - 内核代码的编写风格往往比较自由，缺乏像高级语言中的结构化错误处理机制（如 `try...catch`）。
    - 这可能导致错误处理代码分散且难以管理，增加疏忽和遗漏的风险。

3. **错误处理分支的验证**：
    - 许多错误处理分支在正常情况下很难被触发，导致这些分支的正确性难以验证。
    - 确保所有错误处理分支都能正确执行是保证系统稳定性和可靠性的关键。

4. **现有错误注入的范围和策略的不足**
	- 尽管内核提供了一些内置的错误注入机制，如 `fail_make_request` 和 `fail_page_alloc`，但是通常只覆盖特定的内核子系统或功能模块。
	- 现有内核错误注入策略不易修改和集成，需要去/sys/kernel/debug下调整触发概率，无法根据需要做更多操作，可编程性不强。
...

---

  

# 5. 实践
> 其实笔者刚开始是针对一些很常见的注入点进行尝试的，比如`kmalloc`，但是内核已经通过已有的CONFIG_FUNCTION_ERROR_INJECTION机制进行了一些集成，这里为了展示灵活性，我们选用更底层和不容易复现的错误注入进行尝试：

## 目标故障注入点：**mellanox NIC驱动与硬件交互的handler函数：**
```c
// drivers/net/ethernet/mellanox/mlx5/core/cmd.c#mlx5_cmd_exec
int mlx5_cmd_exec(struct mlx5_core_dev *dev, void *in, int in_size, void *out, int out_size)
```


---
## 5.1 内核函数打入宏
```c
//这里可能需要 #include <asm-generic/error-injection.h>
ALLOW_ERROR_INJECTION(mlx5_cmd_exec, ERRNO);

int mlx5_cmd_exec(struct mlx5_core_dev *dev, void *in, int in_size, void *out,
		  int out_size)
{
	int err;

	err = cmd_exec(dev, in, in_size, out, out_size, NULL, NULL, false);
	return err ? : mlx5_cmd_check(dev, in, out);
}
```


## 5.2 编写eBPF程序
```c
#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_tracing.h>
#include "bpf/bpf_core_read.h"

struct {
    __uint(type, BPF_MAP_TYPE_HASH);
    __type(key, u32);
    __type(value, u32);
    __uint(max_entries, 1024);
} fail_count SEC(".maps");

SEC("kprobe/mlx5_cmd_exec")
int Override_mlx5_cmd_exec(struct pt_regs *ctx) {
    // 获取当前进程的tgid
    u32 pid = bpf_get_current_pid_tgid() >> 32;
    // 获取当前进程名称
    char comm[TASK_COMM_LEN];
    bpf_get_current_comm(comm, TASK_COMM_LEN);
    u64 timestamp = bpf_ktime_get_ns();

    // 时间戳生成一个随机数
    u64 random_value = timestamp % 100;

    // 希望 10% 的概率返回 -EIO (-5)
    if (random_value < 10) {
        bpf_printk("[ERR_MLX_CMD_INJECTION] ----拦截cmd请求:%s : %d ----",comm, pid);
        bpf_override_return(ctx, -5);
    }

    return 0;
}

char _license[] SEC("license") = "GPL";
```

> **接下来你可以选择**：
> 1. 直接通过clang的`clang -O2 -target bpf -c example.c -o example.o` + bpftool的`sudo bpftool prog load example.o /sys/fs/bpf/example`进行挂载
> 
> 2. 使用一些其他的eBPF框架进行集成，如`libbpf-bootstrap/gobpf/cliuim`等。大部分框架的内核态eBPF文件都是使用C进行编写的（如上）


## 5.3 效果
使用 `ip link set ethX down` 会偶尔触发（因为我们设置了10%的概率）：
![[img_v3_02dv_8b3c1a56-946b-4351-b166-af373d0c453g.jpg]]


# 6. 安全性与性能影响
- **系统稳定性**：
	错误注入可能导致系统不稳定，甚至崩溃。建议在受控环境中进行错误注入测试，确保系统在异常情况下的稳定性。
- **额外开销**：
	KPROBE_OVERRIDE 在运行时插入断点并进入`eBPF-VM`执行自定义代码，这会引入额外的开销，影响系统性能。



# 7. 未来展望
1. eBPF滥用一直是一个被广受讨论的问题，接口的漏出会带来的更大的攻击面。但是毫无置疑，kprobe_override特性的出现非常符合eBPF的本心，允许开发者在运行时动态修改内核函数的行为，从而模拟各种错误条件。这对于内核开发和测试来说是一个非常有价值的工具，可以帮助开发者验证内核代码在异常情况下的行为，提高系统的健壮性和可靠性。
2. 你会发现，内核被标记为支持ALLOW_INJECTION的函数其实很少，原生仅支持对所有syscall的错误注入，btrfs的错误注入。当你menuconfig打开更多INJECTION特性时，手脚会稍有放开
	![[Pasted image 20240822184703.png]]
	但是，每当我们针对新的需求，添加新的白名单函数，我们都要重新编译内核。



# 8. One More Thing
> Re:但是，每当我们针对新的需求，添加新的白名单函数，我们都要重新编译内核。

实际上我们完全可以通过一些手段，对符合模式（pattern）的所有函数进行一次性标记，内核诸多的宏其实给了我们很大的便利。我们完全可以针对业务需要去自定义这个`模式`，去增强我们业务的稳定性，鲁棒性。

或者还有没有一种可能，每当有新的驱动`.ko`模块的出现，我们的**CI Pipline**会把对应驱动的所有代码给到`LLM(大模型)`，然后大模型**会给出关键的函数以及对应ERROR，并自动生成eBPF程序**，供我们使能KPROBE_OVERRIDE功能？
![[img_v3_02e0_7e74ea60-0099-45b8-9852-c31a160ad76g 3.jpg]]

一查吓一跳，真有了！![[Pasted image 20240822185810.png]]
不过是更加通用型的，完全可以被魔改后接入！

>Just Think Different.



# 9. 参考文献
1. [Helper Function 'bpf\_override\_return' - eBPF Docs](https://ebpf-docs.dylanreimerink.nl/linux/helper-function/bpf_override_return/)
2. [GitHub - eunomia-bpf/GPTtrace-web: Generate bpftrace eBPF programs online with GPT or LLM](https://github.com/eunomia-bpf/GPTtrace-web)
3. [Linux Kernel Driver DataBase: CONFIG\_BPF\_KPROBE\_OVERRIDE: Enable BPF programs to override a kprobed function](https://cateee.net/lkddb/web-lkddb/BPF_KPROBE_OVERRIDE.html)
4. [Linux中基于eBPF的恶意利用与检测机制 - 美团技术团队](https://tech.meituan.com/2022/04/07/how-to-detect-bad-ebpf-used-in-linux.html)