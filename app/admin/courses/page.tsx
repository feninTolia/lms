import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from './_components/AdminCourseCard';
import EmptyState from '@/components/general/EmptyState';
import { Suspense } from 'react';

const CoursesPage = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link href={'/admin/courses/create'} className={buttonVariants()}>
          Create course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
};

async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a new course to get started"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-7">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
    </div>
  );
}

export default CoursesPage;
