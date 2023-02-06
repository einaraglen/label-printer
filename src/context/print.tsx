import React, { ReactNode, useEffect } from "react";
import { create } from "zustand";
import Dymo from "../api/dymo";
import { cleanXMLString } from "../utils";

const test = [
    {
        key: "Number",
        data: "Part No"
    },
    {
        key: "Description",
        data: "Part Description"
    },
    {
        key: "Info",
        data: "Location No"
    },
    {
        key: "Quantity",
        data: "On Hand Qty"
    }
]

export type PrintContext = {
  payload: any[] | null;
  keys: string[];
  template: string | null;
  labels: string[],
  set: any;
};

export const usePrintContext = create<PrintContext>((set: any) => ({
  payload: null,
  keys: [],
  template: null,
  labels: [],
  set,
}));

interface Props {
  children: ReactNode;
}

const PrintProvider = ({ children }: Props) => {
  const { set, template, payload } = usePrintContext();

  const subscribe = () => {
    window.main.on.file((res) => {
      set({ payload: res.Table.Row });
    });
  };

  const init = () => {
    window.main.GetFile().then((res) => {
        console.log(res)
      set({ payload: res });
    });
    window.main.GetTemplate().then((res) => {
      const keys = Array.from(
        new Set<string>(res.match(/(?<=\{)(.*?)(?=\})/g))
      );
      set({ keys, template: res });
    });
  };

  useEffect(() => {
    init();
    subscribe();
  }, []);

  useEffect(() => {
    if (template == null || payload == null) {
      return;
    }

    const clean = cleanXMLString(template)

    const labels = payload.map((line) => {
        return test.reduce<string>((res, curr) => {
            return res.replaceAll(`{${curr.key}}`, line[curr.data])
        }, clean)
    })

    const client = new Dymo();

    const promises = labels.map((label) => client.getLabel(label).then(({ data }) => data))
    Promise.all(promises).then((res) => set({ labels: res }))
  }, [template, payload]);

  return <>{children}</>;
};

export default PrintProvider;
