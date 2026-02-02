"use client";

import { useRef } from "react";
import DesktopGrid from "./components/DesktopGrid";
import WindowManager from "./components/WindowManager";
import Taskbar from "./components/Taskbar";

export default function Desktop() {
	const workspaceRef = useRef<HTMLDivElement>(null);

	return (
		<div className="retro-desktop">
			<WindowManager containerRef={workspaceRef}>
				{({ openApp, windows, restore, focus }) => (
					<>
						<div ref={workspaceRef} className="retro-desktop-workspace">
							<DesktopGrid onOpenApp={openApp} />
						</div>

						<Taskbar
							windows={windows}
							onRestore={restore}
							onFocus={focus}
						/>
					</>
				)}
			</WindowManager>
		</div>
	);
}
