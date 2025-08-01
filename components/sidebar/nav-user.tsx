'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSignOut } from '@/hooks/useSignOut';
import { authClient } from '@/lib/auth-client';
import {
  IconBook,
  IconCreditCard,
  IconDotsVertical,
  IconHome,
  IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isPending } = authClient.useSession();
  const { handleLogout } = useSignOut();

  if (isPending) {
    return null;
  }

  const user = data?.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage
                  src={user?.image ?? `https://avatar.vercel.sh/${user?.email}`}
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name && user.name.length > 0
                    ? user.name
                    : user?.email.split('@')[0]}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.image ?? `https://avatar.vercel.sh/${user?.email}`
                    }
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name && user?.name.length > 0
                      ? user?.name
                      : user?.email.split('@')[0]}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={'/'}>
                  <IconHome />
                  Homepage
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={'/admin'}>
                  <IconCreditCard />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={'/admin/courses'}>
                  <IconBook />
                  Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
