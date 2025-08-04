import { getLessonContent } from '@/app/data/course/get-lesson-content';
import CourseContent from './_components/CourseContent';

type Props = {
  params: Promise<{ lessonId: string }>;
};

const LessonContentPage = async ({ params }: Props) => {
  const { lessonId } = await params;
  const lesson = await getLessonContent(lessonId);

  return <CourseContent data={lesson} />;
};

export default LessonContentPage;
