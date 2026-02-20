import { useState, useCallback } from "react";
import { APPS } from "../../apps/registry";
import type { AppId } from "../../apps/registry";
import DesktopIcon from "./DesktopIcon";

export interface IconPosition {
	x: number;
	y: number;
}

interface DesktopGridProps {
	onOpenApp: (id: AppId) => void;
}

const GRID_SIZE = 80;
const GRID_HEIGHT = 85;
const GRID_PADDING = 8;

export default function DesktopGrid({ onOpenApp }: DesktopGridProps) {
	const [selectedId, setSelectedId] = useState<AppId | null>(null);
	const [hoveredGrid, setHoveredGrid] = useState<{ col: number; row: number } | null>(null);

	const [iconPositions, setIconPositions] = useState<Map<AppId, IconPosition>>(() => {
		const positions = new Map<AppId, IconPosition>();
		APPS.forEach((app, index) => {
			const col = Math.floor(index / 8);
			const row = index % 8;
			positions.set(app.id, {
				x: col * GRID_SIZE + GRID_PADDING,
				y: row * GRID_HEIGHT + GRID_PADDING,
			});
		});
		return positions;
	});

	const handleDesktopClick = useCallback((e: React.MouseEvent) => {
		if (!(e.target as HTMLElement).closest(".desktop-icon-button")) {
			setSelectedId(null);
		}
	}, []);

	const isGridOccupied = useCallback((col: number, row: number, excludeId?: AppId) => {
		const targetX = col * GRID_SIZE + GRID_PADDING;
		const targetY = row * GRID_HEIGHT + GRID_PADDING;
		for (const [id, pos] of iconPositions.entries()) {
			if (excludeId && id === excludeId) continue;
			if (pos.x === targetX && pos.y === targetY) return true;
		}
		return false;
	}, [iconPositions]);

	const snapToGrid = useCallback((rawX: number, rawY: number, draggedId: AppId) => {
		const col = Math.round((rawX - GRID_PADDING) / GRID_SIZE);
		const row = Math.round((rawY - GRID_PADDING) / GRID_HEIGHT);
		if (isGridOccupied(col, row, draggedId)) {
			return iconPositions.get(draggedId) ?? { x: GRID_PADDING, y: GRID_PADDING };
		}
		return {
			x: Math.max(GRID_PADDING, col * GRID_SIZE + GRID_PADDING),
			y: Math.max(GRID_PADDING, row * GRID_HEIGHT + GRID_PADDING),
		};
	}, [isGridOccupied, iconPositions]);

	const handleIconDrag = useCallback((id: AppId, x: number, y: number) => {
		setIconPositions((prev) => new Map(prev).set(id, { x, y }));
		setHoveredGrid({
			col: Math.round((x - GRID_PADDING) / GRID_SIZE),
			row: Math.round((y - GRID_PADDING) / GRID_HEIGHT),
		});
	}, []);

	const handleIconDragEnd = useCallback((id: AppId, x: number, y: number) => {
		setIconPositions((prev) => new Map(prev).set(id, snapToGrid(x, y, id)));
		setHoveredGrid(null);
	}, [snapToGrid]);

	const isOccupied = hoveredGrid
		? isGridOccupied(hoveredGrid.col, hoveredGrid.row, selectedId ?? undefined)
		: false;

	return (
		<div className="desktop-grid" onClick={handleDesktopClick}>
			{hoveredGrid && (
				<div
					className={`grid-highlight ${isOccupied ? "grid-highlight--occupied" : ""}`}
					style={{
						left: `${hoveredGrid.col * GRID_SIZE + GRID_PADDING}px`,
						top: `${hoveredGrid.row * GRID_HEIGHT + GRID_PADDING}px`,
						width: `${GRID_SIZE - 4}px`,
						height: `${GRID_HEIGHT - 4}px`,
					}}
				/>
			)}
			{APPS.map((app) => {
				const position = iconPositions.get(app.id) ?? { x: 0, y: 0 };
				return (
					<DesktopIcon
						key={app.id}
						title={app.title}
						icon={app.icon}
						onOpen={() => onOpenApp(app.id)}
						isSelected={selectedId === app.id}
						onSelect={() => setSelectedId(app.id)}
						position={position}
						onDrag={(x, y) => handleIconDrag(app.id, x, y)}
						onDragEnd={(x, y) => handleIconDragEnd(app.id, x, y)}
					/>
				);
			})}
		</div>
	);
}
