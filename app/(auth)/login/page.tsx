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
import { GithubIcon } from 'lucide-react';

const LoginPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your GitHub or Email account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button className="w-full" variant={'outline'}>
          <GithubIcon className="size-4" />
          Sign in with GitHub
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

export default LoginPage;
