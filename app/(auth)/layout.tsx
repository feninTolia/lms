import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href={'/'}
        className={buttonVariants({
          variant: 'outline',
          className: 'absolute top-4 left-4',
        })}
      >
        <ArrowLeft size={4} />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6 my-4">
        <Link
          href={'/'}
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            alt="logo"
            src={'/logo.png'}
            width={150}
            height={100}
            className="w-20 -mt-1"
          />
          TolikLMS.
        </Link>
        {children}

        <div className="text-muted-foreground text-xs text-balance text-center">
          By clicking continue, you agree to our{' '}
          <span className="hover:text-primary hover:underline">
            Terms of service
          </span>{' '}
          and{' '}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
