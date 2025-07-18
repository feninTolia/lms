'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { tryCatch } from '@/hooks/try-catch';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteCourse } from './actions';

const DeleteCourseRoute = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();

  const onDelete = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error('An unexpected error occurred. Please try again');
        return;
      }

      if (data.status === 'error') {
        toast.error(data.message);
      }
      if (data.status === 'success') {
        toast.success(data.message);
        router.push('/admin/courses');
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action can not be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 items-center justify-end">
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href={`/admin/courses`}
          >
            Cancel
          </Link>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? 'Deleting' : 'Delete'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCourseRoute;
