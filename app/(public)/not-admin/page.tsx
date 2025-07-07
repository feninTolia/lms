import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, ShieldX } from 'lucide-react';
import Link from 'next/link';

const NotAdminPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="rounded-full p-4 bg-destructive/20 w-fit mx-auto">
            <ShieldX className="text-destructive size-16" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto text-balance">
            Hey! You are not an admin, which means you cannot create any courses
            or stuff like that ...
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/" className={buttonVariants({ className: 'w-full' })}>
            <ArrowLeft className="mr-1 size-4" />
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminPage;
