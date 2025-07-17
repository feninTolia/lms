'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useConstructUrl } from '@/hooks/use-construct';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { v4 } from 'uuid';
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from './RenderState';

type UploaderState = {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  isError: boolean;
  objectUrl?: string;
  fileType: 'image' | 'video';
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted?: 'image' | 'video';
};

export function Uploader({
  value,
  onChange,
  fileTypeAccepted = 'image',
}: Props) {
  const fileUrl = useConstructUrl(value ?? '');

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    isError: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

      try {
        // 1. Get presigned url
        const presignedResponse = await fetch('/api/s3/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === 'image' ? true : false,
          }),
        });

        if (!presignedResponse.ok) {
          toast.error('Failed to get presigned URL');
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            isError: true,
          }));

          return;
        }

        const { presignedUrl, key } = await presignedResponse.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = (event.loaded / event.total) * 100;

              setFileState((prev) => ({
                ...prev,
                progress: Math.round(percentageCompleted),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key,
              }));

              onChange?.(key);

              toast.success('File uploaded successfully');

              resolve();
            } else {
              reject(new Error('Upload failed...'));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Upload failed...'));
          };

          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });
      } catch {
        toast.error('Something went wrong');
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          isError: true,
        }));
      }
    },
    [fileTypeAccepted, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!(acceptedFiles.length > 0)) return;

      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      const file = acceptedFiles[0];
      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        isError: false,
        id: v4(),
        isDeleting: false,
        fileType: fileTypeAccepted,
      });

      uploadFile(file);
    },
    [fileState.objectUrl, fileTypeAccepted, uploadFile]
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error('Failed to remove file from storage');
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          isError: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.('');

      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        isError: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
      });

      toast.success('File removed successfully');
    } catch {
      toast.error('Error removing file. Please try again');
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        isError: true,
      }));
    }
  };

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (!fileRejection.length) return;

    switch (fileRejection[0].errors[0].code) {
      case ErrorCode.FileTooLarge:
        toast.error('File size exceeds the limit (5MB)');
        break;
      case ErrorCode.FileInvalidType:
        toast.error('File type is invalid');
        break;
      case ErrorCode.TooManyFiles:
        toast.error('Too many files selected, max is 1');
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.isError) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleDelete={handleRemoveFile}
          fileType={fileTypeAccepted}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: fileTypeAccepted === 'image' ? 1024 * 1024 * 5 : 1024 * 1024 * 500, // 5mb calculation
    multiple: false,
    accept:
      fileTypeAccepted === 'image' ? { 'image/*': [] } : { 'video/*': [] },
    onDropRejected: rejectedFiles,
    disabled: !!fileState.objectUrl || fileState.uploading,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64',
        isDragActive
          ? 'border-primary bg-primary/20 border-solid'
          : 'border-border hover:border-primary'
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
