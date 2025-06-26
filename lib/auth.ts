import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from './db';
import { env } from './env';
import { resend } from './resend';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        await resend.emails.send({
          from: 'TolikLMS <onboarding@resend.dev>',
          to: [email],
          subject: 'Tolik LMS - Verify your email address',
          html: `<p>Your verify code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
