'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const { data, success } = lessonSchema.safeParse(values);

    if (!success) {
      return { status: 'error', message: 'Invalid data' };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.name,
        description: data.description,
        videoKey: data.videoKey,
        thumbnailKey: data.thumbnailKey,
      },
    });

    return { status: 'success', message: 'Lesson updated successfully' };
  } catch {
    return { status: 'error', message: 'Failed to update lesson' };
  }
}
