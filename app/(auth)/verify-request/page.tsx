'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useTransition } from 'react';
import { toast } from 'sonner';

const VerifyRequest = () => {
  const [otp, setOtp] = useState('');
  const [isEmailPending, startEmailTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get('email');

  const verifyOtp = () => {
    if (!email || !otp) {
      return toast.error('Error verifying Email/OTP. Check all fields');
    }

    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email verified successfully!');
            router.push('/');
          },
          onError: () => {
            toast.error('Error verifying Email/OTP');
          },
        },
      });
    });
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification email code to your email address. Please
          open the email and paste the code below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="flex items-center justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Button
          className="cursor-pointer"
          disabled={otp.length !== 6 || isEmailPending}
          onClick={verifyOtp}
        >
          {isEmailPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              Loading
            </>
          ) : (
            <> Verify Email</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function VerifyRequestRoute() {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  );
}
