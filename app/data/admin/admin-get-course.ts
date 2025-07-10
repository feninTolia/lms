import 'server-only';
import { notFound } from 'next/navigation';
import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';

export const adminGetCourse = async (courseId: string) => {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
