import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet'
import ReduxAccessor from "../store/accessor";
import { parseIFSPage } from "../utils/tools";


const Templates = () => {
  const [IFS, setIFS] = useState<string>("");
    const { filepath } = ReduxAccessor();

    useEffect(() => {
      if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found")
    }, []);

    return <div><Helmet>
    <title>{`LabelPrinter+ | ${IFS} | Templates`}</title>
  </Helmet></div>
}

export default Templates;