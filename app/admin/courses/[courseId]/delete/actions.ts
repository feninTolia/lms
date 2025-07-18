'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function deleteCourse(id: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    await prisma.course.delete({ where: { id } });

    revalidatePath('/admin/courses');
    return { status: 'success', message: 'Course deleted successfully' };
  } catch {
    return { status: 'error', message: 'Failed to delete the course' };
  }
}
