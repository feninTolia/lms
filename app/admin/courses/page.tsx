import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const CoursesPage = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link href={'/admin/courses/create'} className={buttonVariants()}>
          Create course
        </Link>
      </div>
      <div>
        <h1>Here you will see all of your courses</h1>
      </div>
    </>
  );
};

export default CoursesPage;
