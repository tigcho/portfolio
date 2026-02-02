import { useState, useCallback } from "react";
import { APPS } from "../../apps/registry";
import type { AppId } from "../../apps/types";
import DesktopIcon from "./DesktopIcon";

interface DesktopGridProps {
	onOpenApp: (id: AppId) => void;
}

export default function DesktopGrid({ onOpenApp }: DesktopGridProps) {
	const [selectedId, setSelectedId] = useState<AppId | null>(null);

	const handleSelect = useCallback((id: AppId) => {
		setSelectedId(id);
	}, []);

	const handleDesktopClick = useCallback((e: React.MouseEvent) => {
		if ((e.target as HTMLElement).classList.contains("desktop-grid")) {
			setSelectedId(null);
		}
	}, []);

	return (
		<div className="desktop-grid" onClick={handleDesktopClick}>
			{APPS.map((app) => (
				<DesktopIcon
					key={app.id}
					title={app.title}
					icon={app.icon}
					onOpen={() => onOpenApp(app.id)}
					isSelected={selectedId === app.id}
					onSelect={() => handleSelect(app.id)}
				/>
			))}
		</div>
	);
}
