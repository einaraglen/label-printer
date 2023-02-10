import React, { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => {
  return (
    <div className="flex flex-col items-center py-4 max-h-[20rem] h-[20rem]overflow-y-scroll">
      <div className="w-[30rem] flex flex-col space-y-3">{children}</div>
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  undertitle?: any;
  action?: any;
}

export const PageHeader = ({ title, undertitle = " ", action }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-medium text-lg">{title}</span>
        <span className="text-xs text-white/40">{undertitle}</span>
      </div>
      {action || <div></div>}
    </div>
  );
};
