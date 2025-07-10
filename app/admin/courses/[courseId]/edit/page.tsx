import { adminGetCourse } from '@/app/data/admin/admin-get-course';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseStructure from './_components/CourseStructure';
import EditCourseForm from './_components/EditCourseForm';

type Props = {
  params: Promise<{ courseId: string }>;
};

const EditCourse = async ({ params }: Props) => {
  const { courseId } = await params;
  const data = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:{' '}
        <span className="text-primary underline">{data.title}</span>
      </h1>

      <Tabs defaultValue="basic-info">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Edit basic information about the course
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm course={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure">
          <CourseStructure course={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;
