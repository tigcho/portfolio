import type { ComponentType } from "react";

export type AppId = "about" | "projects" | "gallery" | "socials";

export type DesktopApp = {
	id: AppId;
	title: string;
	icon: string; // emoji
	initialSize?: { w: number; h: number };
	initialPos?: { x: number; y: number };
	component: ComponentType;
};
