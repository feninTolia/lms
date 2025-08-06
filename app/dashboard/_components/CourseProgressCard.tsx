'use client';

import { CourseSidebarDataType } from '@/app/data/course/get-course-sidebar-data';
import { EnrolledCourseType } from '@/app/data/user/get-enrolled-courses';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useConstructUrl } from '@/hooks/use-construct';
import { useCourseProgress } from '@/hooks/use-course-progress';
import Image from 'next/image';
import Link from 'next/link';

export function CourseProgressCard({ data }: { data: EnrolledCourseType }) {
  const { totalLessons, progressPercentage, completedLessons } =
    useCourseProgress({
      courseData: data.Course as unknown as CourseSidebarDataType,
    });

  return (
    <Card className="group relative py-0 gap-0">
      {/* absolute badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge>{data.Course.level}</Badge>
      </div>

      <Image
        src={useConstructUrl(data.Course.fileKey)}
        alt="Thumbnail URL"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.Course.slug}`}
          className="font-medium text-lg line-clamp-1 hover:underline group-hover:text-primary transition-colors"
        >
          {data.Course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.Course.smallDescription}
        </p>

        <div className="space-y-2 pt-4">
          <div className="flex justify-between mb-2 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({ className: 'w-full mt-4' })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}
