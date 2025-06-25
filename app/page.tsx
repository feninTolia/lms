'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Successfully logged out!');
        },
        onError: () => {
          toast.error('Failed to log out. Please try again.');
        },
      },
    });
  };

  return (
    <div className="p-4">
      <div className="absolute flex gap-4 items-center top-4 right-4 z-50">
        {session ? (
          <>
            <span>{session.user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          !isPending && (
            <Link href={'/login'} className={buttonVariants({})}>
              Login
            </Link>
          )
        )}
        <ThemeToggle />
      </div>
      <h1 className="text-2xl text-cyan-300">Hi there</h1>
    </div>
  );
}
