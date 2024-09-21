import React from "react";

interface NutriLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

const NutriLayout = (props: NutriLayoutProps) => {
  return (
    <div className="flex flex-1">
      <div className="w-1/5 bg-gray-20">
        <div className="px-6 py-5 gap-5 h-full">
          { props.sidebar }
        </div>
      </div>
      <div className="flex-1">
        <div className="px-6 py-5 gap-5 h-full">
          { props.content }
        </div>
      </div>
    </div>
  )
}

export default NutriLayout;