import type { ComponentType } from "react";

export type DesktopApp = {
	id: string;
	title: string;
	icon: string;
	initialSize?: { w: number; h: number };
	initialPos?: { x: number; y: number };
	component: ComponentType;
};
