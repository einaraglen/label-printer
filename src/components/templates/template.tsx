import React from "react";
import { HiOutlineArrowLongLeft, HiOutlineXCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useTemplateContext } from "../../context/template";
import { Page, PageHeader } from "../library/page/page";

const Variant = ({ variant }: any) => {
  return (
    <Link to={variant.id}>{variant.id}</Link>
  )
}

const Template = () => {
  const { template, variants, refresh } = useTemplateContext();
  const navigate = useNavigate();

  const onDelete = () => {
    window.store.DeleteTemplate(template.id);
    refresh();
    navigate("/templates");
  };

  return (
    <Page>
      <PageHeader
        title={template ? template.name : "Loading"}
        undertitle={
          <Link
            className="hover:text-white transition-all duration-200"
            to="/templates"
          >
            <div className="flex items-center space-x-1">
              <HiOutlineArrowLongLeft className="h-4 w-4" />{" "}
              <span>Back to Templates</span>
            </div>
          </Link>
        }
      />
      <div className="flex flex-grow min-h-[11rem]">
      {variants.map((item) => <Variant key={item.id} variant={item} />)}
      </div>
      <button
        onClick={onDelete}
        className="bg-red-700/90 backdrop-blur-sm text-white font-medium px-4 py-1.5 rounded-xl hover:bg-red-600/90 flex items-center justify-center space-x-1 transition-all duration-200"
      >
        <span>Delete Template</span>
        <HiOutlineXCircle className="h-5 w-5" />
      </button>
    </Page>
  );
};

export default Template;
