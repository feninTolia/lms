'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { request } from '@arcjet/next';
import { revalidatePath } from 'next/cache';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', max: 5, window: '1m' }));

export async function deleteCourse(id: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

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

    await prisma.course.delete({ where: { id } });

    revalidatePath('/admin/courses');
    return { status: 'success', message: 'Course deleted successfully' };
  } catch {
    return { status: 'error', message: 'Failed to delete the course' };
  }
}
