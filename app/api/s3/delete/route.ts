import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { S3 } from '@/lib/clientS3';
import { env } from '@/lib/env';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', max: 5, window: '1m' }));

export async function DELETE(request: Request) {
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
    const key = body.key;

    if (!key) {
      return NextResponse.json(
        { error: 'Missing or invalid object key' },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    });
    await S3.send(command);

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
