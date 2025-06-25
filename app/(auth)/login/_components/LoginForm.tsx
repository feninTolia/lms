'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { GithubIcon, Loader } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

const LoginForm = () => {
  const [isGithubPending, startGithubTransition] = useTransition();

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Successfully signed in with GitHub!');
          },
          onError: () => {
            toast.error('Failed to sign in with GitHub. Please try again.');
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your GitHub or Email account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={isGithubPending}
          className="w-full"
          variant={'outline'}
          onClick={signInWithGithub}
        >
          {isGithubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>

        <div className="relative text-center text-sm py-2 before:absolute before:inset-0 before:border-t before:border-border  before:top-1/2 before:z-0">
          <span className="text-muted-foreground relative z-10 bg-card px-2">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="m@example.com" />
          </div>
          <Button>Continue with Email</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
