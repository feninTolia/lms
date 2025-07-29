'use client';

import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { enrollInCourseAction } from '../actions';
import { Loader2 } from 'lucide-react';

const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollInCourseAction(courseId));

      if (error) {
        toast.error('An unexpected error occurred. Please try again');
        return;
      }

      if (data.status === 'error') {
        toast.error(data.message);
      }
      if (data.status === 'success') {
        toast.success(data.message);
      }
    });
  };

  return (
    <Button onClick={onSubmit} className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="animate-spin size-4" /> Loading...
        </>
      ) : (
        'Enroll Now'
      )}
    </Button>
  );
};

export default EnrollmentButton;
