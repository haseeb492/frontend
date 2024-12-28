import Image from "next/image";
import React from "react";
import notFound from "../assets/404.webp";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-md items-center justify-center">
      <Image src={notFound} alt="404 Page not found" priority />
      <h1 className="lg:text-3xl text-lg px-md text-gray-600 font-bold w-full max-w-[600px] text-center">
        Sorry, we <span className="text-primary">couldn`t </span>find that page.
        But hey, atleast we <span className="text-primary">found</span> each
        other. 👋
      </h1>
    </div>
  );
};

export default NotFound;
