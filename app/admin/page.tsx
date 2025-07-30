import { adminGetEnrollmentStats } from '@/app/data/admin/admin-get-enrollment-stats';
import { adminGetRecentCourses } from '@/app/data/admin/admin-get-recent-courses';
import EmptyState from '@/components/general/EmptyState';
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive';
import { SectionCards } from '@/components/sidebar/section-cards';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from './courses/_components/AdminCourseCard';
import { Suspense } from 'react';

export default async function Page() {
  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <ChartAreaInteractive data={enrollmentData} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent courses</h2>
              <Link
                href={'/admin/courses'}
                className={buttonVariants({ variant: 'outline' })}
              >
                View all courses
              </Link>
            </div>

            <Suspense fallback={<RecentCoursesSkeleton />}>
              <RenderRecentCourses />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="You don't have any courses. Create some to see them here"
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
    </div>
  );
}
