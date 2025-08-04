import { ReactNode } from 'react';
import CourseSidebar from '../_components/CourseSidebar';
import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data';

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

const CourseLayout = async ({ children, params }: Props) => {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      {/* sidebar - 30% */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course} />
      </div>

      {/* main content - 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default CourseLayout;
