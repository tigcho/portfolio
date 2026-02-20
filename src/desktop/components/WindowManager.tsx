import { useMemo, useState, useCallback, useLayoutEffect, useRef } from "react";
import { APPS } from "../../apps/registry";
import type { AppId } from "../../apps/registry";
import type { DesktopApp } from "../../apps/types";
import Window from "./Window";

type WindowInstance = {
	instanceId: string;
	appId: AppId;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	minimized: boolean;
};

interface WindowManagerApi {
	openApp: (id: AppId) => void;
	focus: (instanceId: string) => void;
	restore: (instanceId: string) => void;
	minimize: (instanceId: string) => void;
	windows: WindowInstance[];
}

interface WindowManagerProps {
	children: (api: WindowManagerApi) => React.ReactNode;
	containerRef: React.RefObject<HTMLDivElement | null>;
}

const APPS_BY_ID = new Map<AppId, DesktopApp>(APPS.map((app) => [app.id, app]));

export default function WindowManager({ children, containerRef }: WindowManagerProps) {
	const [windows, setWindows] = useState<WindowInstance[]>([]);
	const zTopRef = useRef(10);
	const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

	useLayoutEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				setContainerSize({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight,
				});
			}
		};
		updateSize();
		const resizeObserver = new ResizeObserver(updateSize);
		if (containerRef.current) resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, [containerRef]);

	const focus = useCallback((instanceId: string) => {
		const newZ = ++zTopRef.current;
		setWindows((prev) =>
			prev.map((w) => w.instanceId === instanceId ? { ...w, z: newZ, minimized: false } : w)
		);
	}, []);

	const openApp = useCallback((appId: AppId) => {
		const app = APPS_BY_ID.get(appId);
		if (!app) return;

		const instanceId = `${appId}-${crypto.randomUUID()}`;
		const w = Math.min(app.initialSize?.w ?? 480, containerSize.width - 20);
		const h = Math.min(app.initialSize?.h ?? 320, containerSize.height - 20);
		const newZ = ++zTopRef.current;

		setWindows((prev) => {
			const offset = prev.filter((win) => win.appId === appId).length * 24;
			const x = Math.min((app.initialPos?.x ?? 60) + offset, Math.max(0, containerSize.width - w));
			const y = Math.min((app.initialPos?.y ?? 30) + offset, Math.max(0, containerSize.height - h));
			return [...prev, { instanceId, appId, x, y, w, h, z: newZ, minimized: false }];
		});
	}, [containerSize]);

	const close = useCallback((instanceId: string) => {
		setWindows((prev) => prev.filter((w) => w.instanceId !== instanceId));
	}, []);

	const minimize = useCallback((instanceId: string) => {
		setWindows((prev) =>
			prev.map((w) => w.instanceId === instanceId ? { ...w, minimized: true } : w)
		);
	}, []);

	const moveResize = useCallback((
		instanceId: string,
		patch: Partial<Pick<WindowInstance, "x" | "y" | "w" | "h">>
	) => {
		setWindows((prev) =>
			prev.map((w) => w.instanceId === instanceId ? { ...w, ...patch } : w)
		);
	}, []);

	const visibleWindows = useMemo(
		() => windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z),
		[windows]
	);

	return (
		<>
			{children({ openApp, focus, restore: focus, minimize, windows })}

			{visibleWindows.map((win) => {
				const app = APPS_BY_ID.get(win.appId);
				if (!app) return null;
				const AppComponent = app.component;
				return (
					<Window
						key={win.instanceId}
						title={app.title}
						icon={app.icon}
						x={win.x}
						y={win.y}
						w={win.w}
						h={win.h}
						z={win.z}
						onFocus={() => focus(win.instanceId)}
						onClose={() => close(win.instanceId)}
						onMinimize={() => minimize(win.instanceId)}
						onChange={(patch) => moveResize(win.instanceId, patch)}
						containerRef={containerRef}
					>
						<AppComponent />
					</Window>
				);
			})}
		</>
	);
}
