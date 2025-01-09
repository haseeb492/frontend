import React from "react";

const DailyQuote = () => {
  return (
    <div className="flex flex-col bg-primary p-4 gap-4 rounded-[5px]">
      <h2 className="text-white text-xl"> Today's Quote </h2>
      <div className="">
        <span className="text-white text-md">
          'No one in the brief history of computing has ever written a perfect
          piece of software. It's unlikely that you'll be the fisrt' - Andy Hunt{" "}
        </span>
      </div>
    </div>
  );
};

export default DailyQuote;
