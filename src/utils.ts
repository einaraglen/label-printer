import { matchPath, useLocation } from "react-router-dom";

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const cleanXMLString = (xml: any) => {
  return xml.replace(/\s*</g, "<");
};

export const useParams = (path: string) => {
  const { pathname } = useLocation()
  const match = matchPath({ path }, pathname)
  return match?.params || {}
}
