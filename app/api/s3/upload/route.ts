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

export async function POST(request: Request) {
  try {
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
