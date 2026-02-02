import type { DesktopApp } from "./types";
import AboutContent from "./about/AboutContent";
import GalleryContent from "./gallery/GalleryContent";
import SocialsContent from "./socials/SocialsContent";
import ProjectsContent from "./projects/ProjectsContent";

export const APPS: DesktopApp[] = [
	{
		id: "about",
		title: "About Me",
		icon: "📁",
		initialSize: { w: 520, h: 400 },
		component: AboutContent,
	},
	{
		id: "projects",
		title: "Projects",
		icon: "📝",
		component: ProjectsContent,
	},
	{
		id: "gallery",
		title: "Gallery",
		icon: "🖼️",
		initialSize: { w: 600, h: 500 },
		component: GalleryContent,
	},
	{
		id: "socials",
		title: "Socials",
		icon: "🌐",
		component: SocialsContent,
	},
];
