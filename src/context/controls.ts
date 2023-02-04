import { create } from "zustand"

export type ControlsContext = {
    open: boolean
    toggle: () => void
    set: any
}

export const useControlsContext = create<ControlsContext>((set: any) => ({
    open: false,
    toggle: () => set((state: ControlsContext) => ({ open: !state.open })),
    set
}))
