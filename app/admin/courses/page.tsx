import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { AdminCourseCard } from './_components/AdminCourseCard';

const CoursesPage = async () => {
  const data = await adminGetCourses();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link href={'/admin/courses/create'} className={buttonVariants()}>
          Create course
        </Link>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 gap-7">
        {data.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    </>
  );
};

export default CoursesPage;
