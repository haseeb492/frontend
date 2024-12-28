import React from "react";
import Clock from "../Clock";

interface HeaderCardProps {
  title: string;
  subTitle: string;
}

const HeaderCard = ({ title, subTitle }: HeaderCardProps) => {
  return (
    <div className="flex justify-between px-4 py-2 h-auto border border-gray-300 shadow-md shadow-gray-400 w-full rounded-[5px]">
      <div className="flex flex-col">
        <h2 className="text-3xl text-primary">{title}</h2>
        <span className="text-md text-slate-500">{subTitle}</span>
      </div>
      <Clock />
    </div>
  );
};

export default HeaderCard;
