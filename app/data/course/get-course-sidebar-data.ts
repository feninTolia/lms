import 'server-only';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '../user/require-user';

export const getCourseSidebarData = async (slug: string) => {
  const session = await requireUser();

  const data = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
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
              position: true,
              description: true,
            },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { courseId_userId: { userId: session.user.id, courseId: data.id } },
  });

  if (!enrollment || enrollment.status !== 'Active') {
    return notFound();
  }

  return data;
};

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
