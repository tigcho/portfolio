import { useMemo, useState, useCallback, useLayoutEffect } from "react";
import { APPS } from "../../apps/registry";
import type { AppId, DesktopApp } from "../../apps/types";
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

export default function WindowManager({
	children,
	containerRef,
}: WindowManagerProps) {
	const appsById = useMemo(() => {
		const map = new Map<AppId, DesktopApp>();
		for (const app of APPS) map.set(app.id, app);
		return map;
	}, []);

	const [windows, setWindows] = useState<WindowInstance[]>([]);
	const [zTop, setZTop] = useState(10);
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
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [containerRef]);

	const openApp = useCallback(
		(appId: AppId) => {
			const app = appsById.get(appId);
			if (!app) return;

			const instanceId = `${appId}-${crypto.randomUUID()}`;

			const w = Math.min(app.initialSize?.w ?? 480, containerSize.width - 20);
			const h = Math.min(app.initialSize?.h ?? 320, containerSize.height - 20);

			setWindows((prev) => {
				const existingCount = prev.filter((win) => win.appId === appId).length;
				const offset = existingCount * 24;

				const maxX = Math.max(0, containerSize.width - w);
				const maxY = Math.max(0, containerSize.height - h);

				const baseX = app.initialPos?.x ?? 60;
				const baseY = app.initialPos?.y ?? 30;

				const x = Math.min(baseX + offset, maxX);
				const y = Math.min(baseY + offset, maxY);

				const maxZ = prev.reduce((max, win) => Math.max(max, win.z), zTop);
				const newZ = maxZ + 1;

				return [
					...prev,
					{ instanceId, appId, x, y, w, h, z: newZ, minimized: false },
				];
			});

			setZTop((currentZ) => currentZ + 1);
		},
		[appsById, zTop, containerSize]
	);

	const focus = useCallback((instanceId: string) => {
		setZTop((currentZ) => {
			const newZ = currentZ + 1;
			setWindows((prev) =>
				prev.map((w) =>
					w.instanceId === instanceId
						? { ...w, z: newZ, minimized: false }
						: w
				)
			);
			return newZ;
		});
	}, []);

	const close = useCallback((instanceId: string) => {
		setWindows((prev) => prev.filter((w) => w.instanceId !== instanceId));
	}, []);

	const minimize = useCallback((instanceId: string) => {
		setWindows((prev) =>
			prev.map((w) =>
				w.instanceId === instanceId ? { ...w, minimized: true } : w
			)
		);
	}, []);

	const restore = useCallback(
		(instanceId: string) => {
			focus(instanceId);
		},
		[focus]
	);

	const moveResize = useCallback(
		(
			instanceId: string,
			patch: Partial<Pick<WindowInstance, "x" | "y" | "w" | "h">>
		) => {
			setWindows((prev) =>
				prev.map((w) =>
					w.instanceId === instanceId ? { ...w, ...patch } : w
				)
			);
		},
		[]
	);

	const visibleWindows = useMemo(
		() =>
			windows
				.filter((w) => !w.minimized)
				.sort((a, b) => a.z - b.z),
		[windows]
	);

	return (
		<>
			{children({ openApp, focus, restore, minimize, windows })}

			{visibleWindows.map((win) => {
				const app = appsById.get(win.appId);
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
