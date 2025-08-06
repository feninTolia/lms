import { getLessonContent } from '@/app/data/course/get-lesson-content';
import { Suspense } from 'react';
import CourseContent from './_components/CourseContent';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  params: Promise<{ lessonId: string }>;
};

const LessonContentPage = async ({ params }: Props) => {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonContentSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
};

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const lesson = await getLessonContent(lessonId);

  return <CourseContent data={lesson} />;
}

async function LessonContentSkeleton() {
  return (
    <div className="w-full pl-6 flex flex-col h-full">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="py-4 border-b">
        <Skeleton className="w-44 h-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 w-72 h-10 rounded-lg" />
      <Skeleton className="mt-3 w-96 h-10 rounded-lg" />
      <Skeleton className="mt-3 w-full h-60 rounded-lg" />
    </div>
  );
}

export default LessonContentPage;
