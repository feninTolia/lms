import { AdminCourseCardSkeleton } from '@/app/admin/courses/_components/AdminCourseCard';
import { getAllCourses } from '@/app/data/course/get-all-courses';
import { Suspense } from 'react';
import { PublicCourseCard } from '../_components/PublicCourseCard';

export default function PublicCoursesRoute() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Corses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>

      <Suspense fallback={<PublicCoursesSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard data={course} key={course.id} />
      ))}
    </div>
  );
}

function PublicCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
    </div>
  );
}
