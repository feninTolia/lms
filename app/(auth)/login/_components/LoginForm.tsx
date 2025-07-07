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
import { IconBrandGoogle } from '@tabler/icons-react';
import { GithubIcon, Loader, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const LoginForm = () => {
  const router = useRouter();
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isGogglePending, startGoggleTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState('');

  const handelEmailSignIn = async () => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Verification code sent to your email!');
            router.push(`verify-request?email=${encodeURIComponent(email)}`);
          },
          onError: () => {
            toast.error('Failed to send verification code. Please try again.');
          },
        },
      });
    });
  };

  function signInWithGithub() {
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
  async function signInWithGoogle() {
    startGoggleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Successfully signed in with Google!');
          },
          onError: () => {
            toast.error('Failed to sign in with Google. Please try again.');
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

        <Button
          className="w-full"
          variant={'outline'}
          onClick={signInWithGoogle}
        >
          {isGogglePending ? (
            <>
              <Loader className="size-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <IconBrandGoogle className="size-4" />
              Sign in with Google
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
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            onClick={handelEmailSignIn}
            disabled={!email || isEmailPending}
          >
            {isEmailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                Loading
              </>
            ) : (
              <>
                <Send className="size-4" /> Continue with Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
