import 'server-only';
import { notFound } from 'next/navigation';
import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';

export const adminGetLesson = async (lessonId: string) => {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      position: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export type AdminLessonSingularType = Awaited<
  ReturnType<typeof adminGetLesson>
>;
