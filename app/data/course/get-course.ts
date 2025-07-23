import 'server-only';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export const getCourse = async (slug: string) => {
  const data = await prisma.course.findUnique({
    where: { slug },
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
          lessons: {
            select: { id: true, title: true },
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

  return data;
};

export type PublicCourseSingularType = Awaited<ReturnType<typeof getCourse>>;
