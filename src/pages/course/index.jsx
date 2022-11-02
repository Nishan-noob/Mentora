import { TextInput } from "@mantine/core";
import { useState } from "react";
import CourseCard from "../../components/CourseCard";
import LoaderComponent from "../../components/LoaderComponent";
import { IconNotebook } from "@tabler/icons";
import { filterOnSearch } from "../../utils/helper";
import MenuComponent from "../../components/MenuComponent";
import { availableBranches } from "../../utils/constants";
const name_id_map = require("../../../name-id-map.json");

export default function Home() {
  const [branchFilter, setBranchFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const generateCoursesData = (name_id_map) => {
    const coursesData = [];
    Object.keys(name_id_map).map((item) => {
      coursesData.push({
        course_name: name_id_map[item],
        course_id: item,
      });
    });
    return coursesData;
  };

  const courses = generateCoursesData(name_id_map);

  const branchFilteredCourses = () => {
    if (branchFilter === "all") {
      return courses;
    }

    return courses.filter((course) => {
      return course.course_id.startsWith(branchFilter);
    });
  };

  const filteredCourses = filterOnSearch(
    searchQuery,
    branchFilteredCourses(),
    []
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-4 items-center justify-center">
        <div className="max-w-[40rem] flex-1 ">
          <TextInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="filled"
            placeholder="Enter course name/id"
            size="md"
          />
        </div>

        <MenuComponent
          state={branchFilter}
          setState={setBranchFilter}
          Icon={IconNotebook}
          availableFilters={availableBranches}
          title={"Course Branch"}
        />
      </div>
      {courses.length === 0 && <LoaderComponent />}

      <div className="flex justify-center">
        {searchQuery.trim().length !== 0 && filteredCourses?.length === 0 && (
          <p>No course found!</p>
        )}

        {searchQuery.trim().length === 0 && (
          <p className="text-gray-400 mt-2">
            Start typing the Course name/id ...{" "}
          </p>
        )}

        {filteredCourses.length > 0 && (
          <div className="mt-3 grid auto-rows-max justify-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredCourses?.map((course) => (
              <CourseCard
                key={course.course_id}
                name={course.course_name}
                id={course.course_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
