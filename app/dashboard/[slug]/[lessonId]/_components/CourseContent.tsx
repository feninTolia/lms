'use client';
import { LessonContentType } from '@/app/data/course/get-lesson-content';
import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { useConstructUrl } from '@/hooks/use-construct';
import { BookIcon, CheckCircle } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { markLessonComplete } from '../actions';

type Props = {
  data: LessonContentType;
};

const CourseContent = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className=" aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  const onMarkComplete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.Chapter.Course.slug)
      );

      if (error) {
        toast.error('An unexpected error occurred. Please try again');
        return;
      }

      if (result.status === 'error') {
        toast.error(result.message);
      }
      if (result.status === 'success') {
        toast.success(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ''}
        videoKey={data.videoKey ?? ''}
      />

      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600 hover:bg-green-500/20 disabled:opacity-100"
            disabled
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            {isPending ? <p>Loading...</p> : <p>Completed</p>}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onMarkComplete}
            disabled={isPending}
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            {isPending ? <p>Loading...</p> : <p>Mark as Complete</p>}
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>

        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
};

export default CourseContent;
