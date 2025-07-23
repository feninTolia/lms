import { prisma } from '@/lib/db';

export async function getAllCourses() {
  return prisma.course.findMany({
    where: { status: 'Published' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      category: true,
    },
  });
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
