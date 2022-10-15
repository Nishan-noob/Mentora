import Link from "next/link";
import React from "react";

const FolderUI = ({ name, id }) => {
  return (
    <Link href={`/course/${id}`} passHref>
      <div className="folder m-10 text-black hover:scale-105 transition transform duration-100 ease-out hover:cursor-pointer ">
        <p>{name}</p>
        <p>{id}</p>
      </div>
    </Link>
  );
};

export default FolderUI;
