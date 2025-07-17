import { adminGetLesson } from '@/app/data/admin/admin-get-lesson';
import LessonForm from './_components/LessonForm';

type Props = {
  params: Promise<{
    lessonId: string;
    courseId: string;
    chapterId: string;
  }>;
};

const Lesson = async ({ params }: Props) => {
  const { lessonId, chapterId, courseId } = await params;

  const data = await adminGetLesson(lessonId);

  return (
    <div>
      {data.title}
      <LessonForm
        data={data}
        chapterId={chapterId}
        courseId={courseId}
        lessonId={lessonId}
      />
    </div>
  );
};

export default Lesson;
