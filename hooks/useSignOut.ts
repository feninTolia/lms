'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useSignOut() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Successfully logged out!');
          router.push('/');
        },
        onError: () => {
          toast.error('Failed to log out. Please try again.');
        },
      },
    });
  };

  return { handleLogout };
}
