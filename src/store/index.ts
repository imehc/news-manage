import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
	isCollapsed: boolean;
	isLoading: boolean;
	toggleCollapsed: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			isCollapsed: false,
			isLoading: false,
			toggleCollapsed: () =>
				set((state) => ({ isCollapsed: !state.isCollapsed })),
			setLoading: (loading: boolean) => set({ isLoading: loading }),
		}),
		{
			name: "app-store",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ isCollapsed: state.isCollapsed }),
		},
	),
);
