import React, { ReactNode } from "react";
import ErrorProvider from "./error";
import PrintProvider from "./print";
import StatusProvider from "./status";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <ErrorProvider>
      <StatusProvider>
        <PrintProvider>{children}</PrintProvider>
      </StatusProvider>
    </ErrorProvider>
  );
};

export default Providers
