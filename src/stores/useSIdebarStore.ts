import { create } from "zustand";

interface SidebarStore {
    selectedSidebar: string;
    setSelectedSidebar: (key: string) => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
    selectedSidebar: "",
    setSelectedSidebar: (key: string) => set({ selectedSidebar: key }),
}));

export default useSidebarStore;