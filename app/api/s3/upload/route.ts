import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { S3 } from '@/lib/clientS3';
import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';
import { z } from 'zod';

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: 'Filename is required' }),
  contentType: z.string().min(1, { message: 'Content type is required' }),
  size: z.number().min(1, { message: 'Size is required' }),
  isImage: z.boolean(),
});

const aj = arcjet
  .withRule(detectBot({ mode: 'LIVE', allow: [] }))
  .withRule(fixedWindow({ mode: 'LIVE', max: 5, window: '1m' }));

export async function POST(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: 'Request is not allowed' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid Request Body' },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${v4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 });

    const response = { presignedUrl, key: uniqueKey };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
