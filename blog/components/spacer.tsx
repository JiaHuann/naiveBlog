'use client'
import {Spacer} from "@nextui-org/react";
import BlogCardShown from "./CustomCard";
import { getRandomImage } from "@/lib/util/image";

const BlogInfo = [
  {
    href: "allContent/Kernel/ebpf/Android/解决Android-ebpf的MAP保存字符串的问题.html",
    title: "解决Android-ebpf的MAP保存字符串的问题",
    subContent: "安卓封装的eBPF文档真的好少~",
    tags: "#android #eBPF ",
  },
  {
    href: "allContent/浅析KPROBE_OVEERRIDE在错误注入中的使用.html",
    title: "浅析KPROBE_OVEERRIDE在错误注入中的使用",
    subContent: "licensed under CC-BY-NC-SA 仅作分享，已在公司申请专利。",
    tags: "标签 3, 标签 4",
  }
  // 添加更多博客条目
];
export default async function MySpacer() {
  return (
    <div className="space-y-5">
      {BlogInfo.map(async (blog, index) => (
        <BlogCardShown
          key={index}
          href={blog.href}
          title={blog.title}
          subContent={blog.subContent}
          tags={blog.tags}
          imageUrl={await getRandomImage()}
        />
      ))}
      <Spacer />
      
    </div>
  );
}