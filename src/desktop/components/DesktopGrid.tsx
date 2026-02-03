import { useState, useCallback } from "react";
import { APPS } from "../../apps/registry";
import type { AppId } from "../../apps/types";
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
			const col = Math.floor(index / 8); // 8 icons per column
			const row = index % 8;
			positions.set(app.id, {
				x: col * GRID_SIZE + GRID_PADDING,
				y: row * GRID_HEIGHT + GRID_PADDING
			});
		});
		return positions;
	});

	const handleSelect = useCallback((id: AppId) => {
		setSelectedId(id);
	}, []);

	const handleDesktopClick = useCallback((e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.desktop-icon-button')) {
			setSelectedId(null);
		}
	}, []);

	const isGridOccupied = useCallback((col: number, row: number, excludeId?: AppId) => {
		const targetX = col * GRID_SIZE + GRID_PADDING;
		const targetY = row * GRID_HEIGHT + GRID_PADDING;

		for (const [id, pos] of iconPositions.entries()) {
			if (excludeId && id === excludeId) continue;
			if (pos.x === targetX && pos.y === targetY) {
				return true;
			}
		}
		return false;
	}, [iconPositions]);

	const snapToGrid = useCallback((rawX: number, rawY: number, draggedId: AppId) => {
		const col = Math.round((rawX - GRID_PADDING) / GRID_SIZE);
		const row = Math.round((rawY - GRID_PADDING) / GRID_HEIGHT);

		const snappedX = col * GRID_SIZE + GRID_PADDING;
		const snappedY = row * GRID_HEIGHT + GRID_PADDING;

		if (isGridOccupied(col, row, draggedId)) {
			return iconPositions.get(draggedId) || { x: GRID_PADDING, y: GRID_PADDING };
		}

		return { x: Math.max(GRID_PADDING, snappedX), y: Math.max(GRID_PADDING, snappedY) };
	}, [isGridOccupied, iconPositions]);

	const handleIconDrag = useCallback((id: AppId, x: number, y: number) => {
		setIconPositions(prev => {
			const newPositions = new Map(prev);
			newPositions.set(id, { x, y });
			return newPositions;
		});

		const col = Math.round((x - GRID_PADDING) / GRID_SIZE);
		const row = Math.round((y - GRID_PADDING) / GRID_HEIGHT);
		setHoveredGrid({ col, row });
	}, []);

	const handleIconDragEnd = useCallback((id: AppId, x: number, y: number) => {
		const snapped = snapToGrid(x, y, id);
		setIconPositions(prev => {
			const newPositions = new Map(prev);
			newPositions.set(id, snapped);
			return newPositions;
		});
		setHoveredGrid(null);
	}, [snapToGrid]);

	const renderGridHighlight = () => {
		if (!hoveredGrid) return null;

		const { col, row } = hoveredGrid;
		const isOccupied = isGridOccupied(col, row, selectedId || undefined);

		return (
			<div
				className="grid-highlight"
				style={{
					left: `${col * GRID_SIZE + GRID_PADDING}px`,
					top: `${row * GRID_HEIGHT + GRID_PADDING}px`,
					width: `${GRID_SIZE - 4}px`,
					height: `${GRID_HEIGHT - 4}px`,
					backgroundColor: isOccupied ? 'rgba(255, 0, 0, 0.1)' : 'rgba(192, 192, 192, 0.3)',
					border: isOccupied ? '2px dashed #ff0000' : '2px dashed #808080',
				}}
			/>
		);
	};

	return (
		<div className="desktop-grid" onClick={handleDesktopClick}>
			{renderGridHighlight()}
			{APPS.map((app) => {
				const position = iconPositions.get(app.id) ?? { x: 0, y: 0 };

				return (
					<DesktopIcon
						key={app.id}
						title={app.title}
						icon={app.icon}
						onOpen={() => onOpenApp(app.id)}
						isSelected={selectedId === app.id}
						onSelect={() => handleSelect(app.id)}
						position={position}
						onDrag={(x: number, y: number) => handleIconDrag(app.id, x, y)}
						onDragEnd={(x: number, y: number) => handleIconDragEnd(app.id, x, y)}
					/>
				);
			})}
		</div>
	);
}
