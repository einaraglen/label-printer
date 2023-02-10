import React, { useState } from "react";
import { HiOutlineArrowLongLeft, HiOutlineCheckCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Input from "../library/input";
import { Page, PageHeader } from "../library/page/page";
import Textarea from "../library/textarea";
import { v4 } from "uuid";
import { useTemplateContext } from "../../context/template";

const CreateTemplate = () => {
  const { refresh } = useTemplateContext()
  const navigate = useNavigate()
  const [filepath, setFilepath] = useState<string | null>(null);
  const [input, setInput] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const onFile = async (e: any) => {
    if (!e.target.value) return;
    setFilepath(e.target.files[0].path);
  };

  const getFilename = (path: string | null) => {
    if (path == null) {
      return;
    }

    return path.replace(/\\$/, "").split("\\").pop();
  };

  const onSave = () => {
    const id = v4()
    window.store.AddTemplate({
      template_id: id,
      payload: {
        id,
        ...input,
        thumbnail: null,
        filepath: filepath!,
        keys: [],
        configs: {},
        created_at: new Date().toISOString(),
      },
    });
    refresh()
    navigate(`/templates/${id}`)
  };

  return (
    <Page>
      <PageHeader
        title="Create Template"
        undertitle={
          <Link
            className="hover:text-white transition-all duration-200"
            to="/templates"
          >
            <div className="flex items-center space-x-1">
              <HiOutlineArrowLongLeft className="h-4 w-4" />{" "}
              <span>Back to Tempaltes</span>
            </div>
          </Link>
        }
      />
      <div className="flex space-x-3">
        <div className="flex flex-col space-y-1 w-1/2">
          <span className="text-xs pl-1">Name</span>
          <Input name="name" onChange={(e: any) => setInput((i) => ({ ...i, [e.target.name]: e.target.value }))} />
        </div>
        <div className="flex flex-col space-y-1 w-1/2">
          <span className="text-xs pl-1">File</span>
          <input
            id="file-button"
            style={{ display: "none" }}
            accept={".dymo"}
            type="file"
            name="upload_file"
            onChange={onFile}
          />
          <label
            htmlFor="file-button"
            className="text-center truncate w-full cursor-pointer outline-none bg-black/40 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm rounded-xl py-2 px-4"
          >
            {getFilename(filepath) || "Select"}
          </label>
        </div>
      </div>
      <div className="flex flex-col space-y-1 w-full">
        <span className="text-xs pl-1">Description</span>
        <Textarea name="description" onChange={(e: any) => setInput((i) => ({ ...i, [e.target.name]: e.target.value }))} />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="bg-green-700/90 backdrop-blur-sm text-white font-medium px-4 py-1.5 rounded-xl hover:bg-green-600/90 flex items-center space-x-1 transition-all duration-200"
        >
          <span>Save</span>
          <HiOutlineCheckCircle className="h-5 w-5" />
        </button>
      </div>
    </Page>
  );
};

export default CreateTemplate;
