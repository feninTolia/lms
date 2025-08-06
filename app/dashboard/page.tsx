import EmptyState from '@/components/general/EmptyState';
import { PublicCourseCard } from '../(public)/_components/PublicCourseCard';
import { getAllCourses } from '../data/course/get-all-courses';
import { getEnrolledCourses } from '../data/user/get-enrolled-courses';
import { CourseProgressCard } from './_components/CourseProgressCard';

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  const filteredAllCourses = allCourses.filter(
    (course) => !enrolledCourses.some((enr) => enr.Course.id === course.id)
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You have not purchased any courses yet"
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            // <PublicCourseCard data={course.Course} key={course.Course.id} />
            <CourseProgressCard data={course} key={course.Course.id} />
            // <Link
            //   href={`/dashboard/${course.Course.slug}`}
            //   className={buttonVariants()}
            // >
            //   {course.Course.title}
            // </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>

        {filteredAllCourses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAllCourses.map((course) => (
              <PublicCourseCard data={course} key={course.id} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
