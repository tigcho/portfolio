import { useState, useCallback, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import type { IconPosition } from "./DesktopGrid";

interface DesktopIconProps {
	title: string;
	icon: ReactNode;
	onOpen: () => void;
	isSelected: boolean;
	onSelect: () => void;
	position: IconPosition;
	onDrag: (x: number, y: number) => void;
	onDragEnd: (x: number, y: number) => void;
}

export default function DesktopIcon({
	title,
	icon,
	onOpen,
	isSelected,
	onSelect,
	position,
	onDrag,
	onDragEnd,
}: DesktopIconProps) {
	const [isDragging, setIsDragging] = useState(false);

	const dragStateRef = useRef<{
		startX: number;
		startY: number;
		iconX: number;
		iconY: number;
		hasMoved: boolean;
	} | null>(null);

	const positionRef = useRef(position);
	positionRef.current = position;

	const handleDoubleClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!dragStateRef.current?.hasMoved) onOpen();
	}, [onOpen]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button !== 0) return;
		e.stopPropagation();
		e.preventDefault();
		onSelect();
		dragStateRef.current = {
			startX: e.clientX,
			startY: e.clientY,
			iconX: position.x,
			iconY: position.y,
			hasMoved: false,
		};
	}, [onSelect, position]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!dragStateRef.current) return;
			const dx = e.clientX - dragStateRef.current.startX;
			const dy = e.clientY - dragStateRef.current.startY;
			if (!dragStateRef.current.hasMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
				dragStateRef.current.hasMoved = true;
				setIsDragging(true);
			}
			if (dragStateRef.current.hasMoved) {
				onDrag(
					Math.max(0, dragStateRef.current.iconX + dx),
					Math.max(0, dragStateRef.current.iconY + dy),
				);
			}
		};

		const handleMouseUp = () => {
			if (!dragStateRef.current) return;
			if (dragStateRef.current.hasMoved) {
				onDragEnd(positionRef.current.x, positionRef.current.y);
			}
			dragStateRef.current = null;
			requestAnimationFrame(() => setIsDragging(false));
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [onDrag, onDragEnd]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter") onOpen();
	}, [onOpen]);

	return (
		<button
			type="button"
			onMouseDown={handleMouseDown}
			onDoubleClick={handleDoubleClick}
			onKeyDown={handleKeyDown}
			className="desktop-icon-button"
			aria-label={`Open ${title}`}
			data-selected={isSelected}
			data-dragging={isDragging}
			style={{
				position: "absolute",
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: isDragging ? "grabbing" : "pointer",
				transition: isDragging ? "none" : "left 0.15s ease-out, top 0.15s ease-out",
				zIndex: isDragging ? 1000 : 1,
			}}
		>
			<div className="desktop-icon-highlight" />
			<div className="desktop-icon-selection" data-visible={isSelected} />
			<div className="desktop-icon-image">{icon}</div>
			<div className="desktop-icon-label" data-selected={isSelected}>{title}</div>
		</button>
	);
}
