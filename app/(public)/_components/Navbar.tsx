'use client';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authClient } from '@/lib/auth-client';
import Logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { UserDropdown } from './UserDropdown';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Courses',
    href: '/courses',
  },
  {
    name: 'Dashboard',
    href: '/admin',
  },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter:bg-background/60]">
      <div className="container flex min-h-16 mx-auto items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="logo" className="w-9" />
          <span className="font-bold">TolikLMS.</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center">
          <div className="flex gap-4 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transform-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            {session ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name}
                userImg={session.user.image}
              />
            ) : (
              !isPending && (
                <>
                  <Link
                    href={'/login'}
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    Login
                  </Link>
                  <Link href={'/login'} className={buttonVariants()}>
                    Get Started
                  </Link>
                </>
              )
            )}

            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile */}
      </div>
    </header>
  );
};

export default Navbar;
