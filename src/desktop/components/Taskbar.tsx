import type { AppId, DesktopApp } from "../../apps/types";
import { APPS } from "../../apps/registry";
import { useMemo, useState, useEffect } from "react";

type WindowInfo = {
	instanceId: string;
	appId: AppId;
	minimized: boolean;
};

interface TaskbarProps {
	windows: WindowInfo[];
	onRestore: (instanceId: string) => void;
	onFocus: (instanceId: string) => void;
}

export default function Taskbar({ windows, onRestore, onFocus }: TaskbarProps) {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const appsById = useMemo(() => {
		const map = new Map<AppId, DesktopApp>();
		for (const app of APPS) map.set(app.id, app);
		return map;
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return (
		<div className="retro-taskbar">
			<button type="button" className="retro-start-button">
				<span className="retro-start-icon">🪟</span>
				<span className="retro-start-text">Start</span>
			</button>

			<div className="retro-taskbar-divider" />

			<div className="retro-taskbar-windows">
				{windows.map((win) => {
					const app = appsById.get(win.appId);
					if (!app) return null;

					return (
						<button
							key={win.instanceId}
							type="button"
							onClick={() =>
								win.minimized
									? onRestore(win.instanceId)
									: onFocus(win.instanceId)
							}
							className="retro-taskbar-button"
							data-minimized={win.minimized}
							aria-label={`${win.minimized ? "Restore" : "Focus"} ${app.title}`}
						>
							<span className="retro-taskbar-button-icon">{app.icon}</span>
							<span className="retro-taskbar-button-text">{app.title}</span>
						</button>
					);
				})}
			</div>

			<div className="retro-system-tray">
				<div className="retro-tray-icons">
					<span>🔊</span>
				</div>
				<div className="retro-clock">{formatTime(currentTime)}</div>
			</div>
		</div>
	);
}
