import React from "react";
import { HiOutlineArrowLongRight, HiOutlinePlusCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useTemplateContext } from "../../context/template";
import { Page, PageHeader } from "../library/page/page";

const Item = ({ data }: any) => {
  return (
    <Link
      to={data.id}
      className="bg-black/40 hover:bg-black/60 transition-all duration-200 flex justify-between items-center rounded-xl p-3"
    >
      <div className="flex flex-col">
<span className="font-medium">{data.name}</span>
      <span className="text-xs">{data.description}</span>
      </div>
      <HiOutlineArrowLongRight className="h-5 w-5" />
    </Link>
  );
};

const Templates = () => {
  const { templates } = useTemplateContext();
  return (
    <Page>
      <PageHeader
        title="Templates"
        undertitle="Create unique collections of displaying your data"
        action={
          <Link
            to="create"
            className="bg-green-700/90 backdrop-blur-sm text-white font-medium px-4 py-1.5 rounded-xl hover:bg-green-600/90 transition-all duration-200 flex items-center space-x-1"
          >
            <span>New</span>
            <HiOutlinePlusCircle className="h-5 w-5" />
          </Link>
        }
      />
      {templates.map((item) => (
        <Item key={item.id} data={item} />
      ))}
    </Page>
  );
};

export default Templates;
