import React from "react";
import { HiOutlineArrowLongLeft, HiOutlinePlusCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useTemplateContext } from "../../../context/template";
import { Page, PageHeader } from "../../library/page/page";

const Variant = () => {
    const { template , variant } = useTemplateContext()
    return (
        <Page>
      <PageHeader
        title="Configs"
        undertitle={
            <Link
              className="hover:text-white transition-all duration-200"
              to={`/templates/${template.id}`}
            >
              <div className="flex items-center space-x-1">
                <HiOutlineArrowLongLeft className="h-4 w-4" />{" "}
                <span>Back to Template</span>
              </div>
            </Link>
          }
        action={
          <button
            className="bg-green-700/90 backdrop-blur-sm text-white font-medium px-4 py-1.5 rounded-xl hover:bg-green-600/90 transition-all duration-200 flex items-center space-x-1"
          >
            <span>New</span>
            <HiOutlinePlusCircle className="h-5 w-5" />
          </button>
        }
      />
     
    </Page>
    )
}

export default Variant;