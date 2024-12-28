import React from "react";

interface CircularLoaderProps {
  size?: number;
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ size = 40 }) => {
  return (
    <div
      className={`flex justify-center items-center`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <div
        className="animate-spin rounded-full border-t-4 border-b-4 border-primary"
        style={{
          borderTopColor: "transparent",
          height: `${size}px`,
          width: `${size}px`,
          borderWidth: `${size / 10}px`,
        }}
      ></div>
    </div>
  );
};

export default CircularLoader;
