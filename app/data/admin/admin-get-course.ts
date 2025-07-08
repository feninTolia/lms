import 'server-only';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { requireAdmin } from './require-admin';

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
