import { prisma } from '@/lib/db';
import { requireUser } from './require-user';

export async function getEnrolledCourses() {
  const { user } = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: { userId: user.id, status: 'Active' },
    select: {
      Course: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          level: true,
          slug: true,
          price: true,
          category: true,
          status: true,
          duration: true,
          chapter: {
            select: {
              id: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}
