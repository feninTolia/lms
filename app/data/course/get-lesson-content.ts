import 'server-only';

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { requireUser } from '../user/require-user';

export const getLessonContent = async (lessonId: string) => {
  const session = await requireUser();

  const data = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      position: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      lessonProgress: {
        where: { userId: session.user.id },
        select: { completed: true, lessonId: true },
      },
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        userId: session.user.id,
        courseId: data.Chapter.courseId,
      },
    },
    select: { status: true },
  });

  if (!enrollment || enrollment.status !== 'Active') {
    return notFound();
  }

  return data;
};

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
