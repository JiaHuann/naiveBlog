import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input} from "@nextui-org/react";


export default function MyNavBar() {
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
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit font-mono">LiuJiahuan's Blog</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive>
          <Link className="font-mono" href="#" aria-current="page">
            HomePage
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-mono" color="foreground" href="#">
            Blogs
          </Link>
        </NavbarItem>
        <NavbarItem >
          <Link className="font-mono" href="#" color="foreground">
            About Me
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-mono" color="foreground" href="#">
            MISC
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10 font-mono",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-800/20 dark:bg-default-500/20",
          }}
          placeholder="search sth?"
          size="sm"
          // startContent={<SearchIcon size={18} />}
          type="search"
        />
        {/* <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </NavbarContent>
    </Navbar>
  );
}