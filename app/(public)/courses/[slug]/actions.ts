'use server';

import { requireUser } from '@/app/data/user/require-user';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { ApiResponse } from '@/lib/types';
import { request } from '@arcjet/next';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', window: '1m', max: 5 }));

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const { user } = await requireUser();

  let checkoutUrl: string;

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      return { status: 'error', message: 'You have been blocked' };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        stripePriceId: true,
      },
    });

    if (!course) {
      return { status: 'error', message: 'Course not found' };
    }

    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      //stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: { courseId_userId: { userId: user.id, courseId } },
        select: { status: true, id: true },
      });

      if (existingEnrollment?.status === 'Active') {
        return {
          status: 'success',
          message: 'User is already enrolled in the course',
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            status: 'Pending',
            amount: course.price,
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: 'Pending',
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: course.stripePriceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return { enrollment, checkoutUrl: checkoutSession.url };
    });

    checkoutUrl = result.checkoutUrl as string;

    // return { status: 'success', message: 'Enrolled in course successfully' };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return { status: 'error', message: 'Payment system error.' };
    }
    return { status: 'error', message: 'Failed to enroll in course' };
  }

  redirect(checkoutUrl);
}
