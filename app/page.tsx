import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl text-cyan-300">Hi there</h1>
      <Link href={'/login'} className={buttonVariants()}>
        Login
      </Link>
    </div>
  );
}
