import React, { ReactNode, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { create } from "zustand"
import { useParams } from "../utils"

export type TemplateContext = {
    templates: any[]
    variants: any[]
    template: any | null;
    variant: any | null
    config: any | null
    refresh: Function
    set: any
}

export const useTemplateContext = create<TemplateContext>((set: any) => ({
    templates: [],
    variants: [],
    template: null,
    variant: null,
    config: null,
    refresh: () => window.store.GetTemplates().then((res) => set({ templates: res })),
    set
}))

interface Props {
    children: ReactNode
}

const TemplateProvider = ({ children }: Props) => {
    const { template_id } = useParams('/templates/:template_id/*')
    const { variant_id } = useParams('/templates/:template_id/:variant_id/*')
    const { config_id } = useParams('/templates/:template_id/:variant_id/:config_id/*')
    const { pathname } = useLocation()
    const { set } = useTemplateContext()

    useEffect(() => {
        window.store.GetTemplates().then((res) => console.log(res))
    }, [pathname])

    useEffect(() => {
        window.store.GetTemplates().then((res) => set({ templates: res }))
        window.store.GetVariants().then((res) => set({ variants: res }))
    }, [])

    useEffect(() => {
        if (template_id != null) {
            window.store.GetTemplate(template_id).then((res) => set({ template: res }))
        }

        if (variant_id != null) {
            console.log(variant_id)
            window.store.GetVariant(variant_id).then((res) => set({ variant: res }))
        }

        if (template_id != null && variant_id != null && config_id != null) {
            window.store.GetConfig({ template_id, variant_id, config_id }).then((res) => set({ config: res }))
        }
    }, [template_id, variant_id, config_id])
    
    return (
        <>{children}</>
    )
}

export default TemplateProvider;