'use client'
import { usePathname } from 'next/navigation'; // 使用 usePathname 替代 useRouter
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Popover, PopoverTrigger, PopoverContent, Button, Snippet } from "@nextui-org/react";
import { FileSearchOutlined, GithubFilled, GithubOutlined, MailOutlined, QqOutlined, SearchOutlined, TwitterOutlined } from '@ant-design/icons';

export default function MyNavBar() {
  const pathname = usePathname(); // 获取当前路径

  return (
    <Navbar isBordered
    classNames={{
      item: [
        "flex",
        "relative",
        "h-full",
        "items-center",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-primary",
      ],
    }}>
      <NavbarBrand>
        <p className="font-bold text-inherit font-mono">LiuJiahuan's Blog</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive={pathname === '/'}>
          <Link 
            className={`font-mono ${pathname === '/' ? 'text-primary' : 'text-foreground'}`} 
            href="/" 
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            HomePage
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/blog'}>
          <Link 
            className={`font-mono ${pathname === '/blog' ? 'text-primary' : 'text-foreground'}`} 
            href="/blog"
          >
            Blogs
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/aboutme'}>
          <Link 
            className={`font-mono ${pathname === '/aboutme' ? 'text-primary' : 'text-foreground'}`} 
            href="/aboutme"
          >
            About Me
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/misc'}>
          <Link 
            className={`font-mono ${pathname === '/misc' ? 'text-primary' : 'text-foreground'}`} 
            href="/misc"
          >
            MISC
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" className="ml-2 sm:ml-4 md:ml-8 lg:ml-16 items-center">
        <SearchOutlined></SearchOutlined>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10 font-mono",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-800/20 dark:bg-default-500/20",
          }}
          placeholder="search sth?"
          size="sm"
          type="search"
        />
      </NavbarContent>
      {/* 社交平台引流 */}
      <NavbarContent justify='end'>
        <a target="_blank" href='https://github.com/JiaHuann'><GithubOutlined></GithubOutlined></a>
        
        <Popover placement="right">
          <PopoverTrigger>
            <MailOutlined></MailOutlined>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 font-mono">
              <div className="text-small font-bold">Contact Me With E-Mail</div>
              <div className="text-tiny"><Snippet symbol="" variant="bordered">cheayuki13@gmail.com</Snippet></div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover placement="right">
          <PopoverTrigger>
            <QqOutlined></QqOutlined>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 font-mono">
              <div className="text-small font-bold">Contact Me With QQ</div>
              <div className="text-tiny">
                <Snippet symbol="" variant="bordered">1395622672</Snippet>
                
              </div>
              Mainly used in China Mainland
            </div>
          </PopoverContent>
        </Popover>
        <a target='_blank' href='https://x.com/CheAyuki13'><TwitterOutlined></TwitterOutlined></a>
            
         
      </NavbarContent>
    </Navbar>
  );
}
