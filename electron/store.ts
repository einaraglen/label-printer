import Store from "electron-store"

type Config = {
    id: string
    name: string
    desription: string
    variant_id: string
    key: string
    type: "string" | "number"
    pointers: string[]
}

type Variant = {
    id: string
    cache: string[]
}

type Template = {
    id: string
    name: string
    description: string,
    thumbnail: string | null
    created_at: string
    filepath: string
    keys: string[]
    configs: Record<string, Record<string, Config>>
}

type ApplicationSchema = {
    templates: Record<string, Template>
    variants: Record<string, Variant>
}

enum StoreKey {
    Template = "templates",
    Variant = "variants"
} 

export class ApplicationStore {
    private static store = new Store<ApplicationSchema>()

    public static template = {
       all: () => {
            return this.store.get(StoreKey.Template)
        },
        get: (template_id: string) => {
            const templates = this.store.get(StoreKey.Template)
            return templates[template_id]
        },
        add: ({ template_id, payload }: { template_id: string, payload: Template }) => {
            const templates = this.store.get(StoreKey.Template)
            const variants = this.store.get(StoreKey.Variant)
            const configs = Object.keys(variants).reduce<Record<string, any>>((res, curr) => {
                res[curr] = {}
                return res
            }, {})
            templates[template_id] = { ...payload, configs }
            this.store.set(StoreKey.Template, templates)
        },
        variant: (variant_id: string) => {
            const templates = this.store.get(StoreKey.Template)
            const temp: Record<string, Template> = {}
            for (const key in templates) {
                const previous = templates[key]
                temp[key] = { ...previous, configs: { ...previous.configs, [variant_id]: {} } }
            }
            this.store.set(StoreKey.Template, temp)
        },
        update: ({ template_id, payload }: { template_id: string, payload: Partial<Template> }) => {
            const templates = this.store.get(StoreKey.Template)
            templates[template_id] = { ...templates[template_id], ...payload }
            this.store.set(StoreKey.Template, templates)
        },
        delete: (template_id: string) => {
            const templates = this.store.get(StoreKey.Template)
            delete templates[template_id]
            this.store.set(StoreKey.Template, templates)
        }
    }

    public static config = {
        all: (template_id: string) => {
            return this.template.get(template_id).configs
        },
        get: ({ template_id, variant_id, config_id }: { template_id: string, variant_id: string, config_id: string }) => {
            return this.template.get(template_id).configs[variant_id][config_id]
        },
        add: ({ template_id, variant_id, payload }: { template_id: string, variant_id: string, payload: Config }) => {
            const template = this.template.get(template_id)
            const configs = template.configs[variant_id]
            template.configs[variant_id] = { ...configs, [payload.id]: payload }
            this.template.update({ template_id, payload: template })
        },
        update: ({ template_id, variant_id, config_id, payload }: { template_id: string, variant_id: string, config_id: string, payload: Partial<Config> }) => {
            const template = this.template.get(template_id)
            const configs = template.configs[variant_id]
            template.configs[variant_id] = { ...configs, [config_id]: { ...configs[config_id], ...payload } }
            this.template.update({ template_id, payload: template })
        },
        delete: ({ template_id, variant_id, config_id }: { template_id: string, variant_id: string, config_id: string }) => {
            const template = this.template.get(template_id)
            const configs = template.configs[variant_id]
            delete configs[config_id]
            template.configs[variant_id] = configs
            this.template.update({ template_id, payload: template })
        }
    }

    public static variant = {
        all: () => {
            return this.store.get(StoreKey.Variant)
        },
        get: (variant_id: string) => {
            const variants = this.store.get(StoreKey.Variant)
            return variants[variant_id]
        },
        add: ({ variant_id, payload }: { variant_id: string, payload: Variant }) => {
            const variants = this.store.get(StoreKey.Variant)
            variants[variant_id] = payload
            this.template.variant(variant_id)
            this.store.set(StoreKey.Variant, variants)
        },
        update: ({ variant_id, payload }: { variant_id: string, payload: Partial<Variant> }) => {
            const variants = this.store.get(StoreKey.Variant)
            variants[variant_id] = { ...variants[variant_id], ...payload }
            this.store.set(StoreKey.Variant, variants)
        },
    }

}