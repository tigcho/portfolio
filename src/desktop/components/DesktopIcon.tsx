import { useState, useCallback } from "react";
import type { ReactNode } from "react";

interface DesktopIconProps {
	title: string;
	icon: ReactNode;
	onOpen: () => void;
	isSelected: boolean;
	onSelect: () => void;
}

export default function DesktopIcon({
	title,
	icon,
	onOpen,
	isSelected,
	onSelect,
}: DesktopIconProps) {
	const [isHovered, setIsHovered] = useState(false);

	const handleDoubleClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onOpen();
		},
		[onOpen]
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onSelect();
		},
		[onSelect]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				onOpen();
			}
		},
		[onOpen]
	);

	return (
		<button
			type="button"
			onMouseDown={handleMouseDown}
			onDoubleClick={handleDoubleClick}
			onKeyDown={handleKeyDown}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="desktop-icon-button"
			aria-label={`Open ${title}`}
			data-selected={isSelected}
			data-hovered={isHovered}
		>
			<div
				className="desktop-icon-highlight"
				data-visible={isHovered && !isSelected}
			/>

			<div
				className="desktop-icon-selection"
				data-visible={isSelected}
			/>

			<div className="desktop-icon-image">
				{icon}
			</div>

			<div className="desktop-icon-label" data-selected={isSelected}>
				{title}
			</div>
		</button>
	);
}
