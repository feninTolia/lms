'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas';
import { request } from '@arcjet/next';
import { revalidatePath } from 'next/cache';

const aj = arcjet
  .withRule(detectBot({ mode: 'LIVE', allow: [] }))
  .withRule(fixedWindow({ mode: 'LIVE', max: 5, window: '1m' }));

export async function editCourse(
  courseId: string,
  data: CourseSchemaType
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: 'error',
          message: 'You have been blocked due to rate limiting',
        };
      } else {
        return {
          status: 'error',
          message: 'You are a bot! If this is a mistake contact our support.',
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return { status: 'error', message: 'Invalid data' };
    }

    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: { ...result.data },
    });

    return { status: 'success', message: 'Course updated successfully' };
  } catch {
    return { status: 'error', message: 'Failed to update course' };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return { status: 'error', message: 'No lessons provided for reordering' };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId },
        data: { position: lesson.position },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: 'success', message: 'Reordered lessons successfully' };
  } catch {
    return { status: 'error', message: 'Failed to reorder lessons' };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        message: 'No chapters provided for reordering',
        status: 'error',
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id, courseId },
        data: { position: chapter.position },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { message: 'Chapters reordered successfully', status: 'success' };
  } catch {
    return { message: 'Failed to reorder chapters', status: 'error' };
  }
}
