import { useRef, useCallback, useState } from "react";

interface WindowProps {
	title: string;
	icon: React.ReactNode;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	onFocus: () => void;
	onClose: () => void;
	onMinimize: () => void;
	onChange: (patch: Partial<{ x: number; y: number; w: number; h: number }>) => void;
	children: React.ReactNode;
	containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function Window({
	title,
	icon,
	x,
	y,
	w,
	h,
	z,
	onFocus,
	onClose,
	onMinimize,
	onChange,
	children,
	containerRef,
}: WindowProps) {
	const [isMaximized, setIsMaximized] = useState(false);
	const [preMaximizeState, setPreMaximizeState] = useState<{
		x: number;
		y: number;
		w: number;
		h: number;
	} | null>(null);

	const dragRef = useRef<{
		ox: number;
		oy: number;
		startX: number;
		startY: number;
	} | null>(null);

	const getContainerBounds = useCallback(() => {
		if (containerRef.current) {
			return {
				width: containerRef.current.offsetWidth,
				height: containerRef.current.offsetHeight,
			};
		}
		return { width: 800, height: 600 };
	}, [containerRef]);

	const onTitlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			if ((e.target as HTMLElement).closest(".retro-window-controls")) {
				return;
			}
			if (isMaximized) return;
			onFocus();
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
			dragRef.current = { ox: e.clientX, oy: e.clientY, startX: x, startY: y };
		},
		[onFocus, x, y, isMaximized]
	);

	const onTitlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!dragRef.current || isMaximized) return;

			const bounds = getContainerBounds();
			const dx = e.clientX - dragRef.current.ox;
			const dy = e.clientY - dragRef.current.oy;

			const newX = Math.max(
				0,
				Math.min(bounds.width - w, dragRef.current.startX + dx)
			);
			const newY = Math.max(
				0,
				Math.min(bounds.height - h, dragRef.current.startY + dy)
			);

			onChange({ x: newX, y: newY });
		},
		[w, h, onChange, getContainerBounds, isMaximized]
	);

	const onTitlePointerUp = useCallback((e: React.PointerEvent) => {
		if (dragRef.current) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			dragRef.current = null;
		}
	}, []);

	const handleMaximize = useCallback(() => {
		onFocus();

		if (isMaximized) {
			if (preMaximizeState) {
				onChange({
					x: preMaximizeState.x,
					y: preMaximizeState.y,
					w: preMaximizeState.w,
					h: preMaximizeState.h,
				});
			}
			setIsMaximized(false);
			setPreMaximizeState(null);
		} else {
			setPreMaximizeState({ x, y, w, h });
			const bounds = getContainerBounds();
			onChange({
				x: 0,
				y: 0,
				w: bounds.width,
				h: bounds.height,
			});
			setIsMaximized(true);
		}
	}, [isMaximized, preMaximizeState, x, y, w, h, onChange, getContainerBounds, onFocus]);

	const handleTitleBarDoubleClick = useCallback(
		(e: React.MouseEvent) => {
			if ((e.target as HTMLElement).closest(".retro-window-controls")) {
				return;
			}
			handleMaximize();
		},
		[handleMaximize]
	);

	return (
		<div
			className="retro-window"
			style={{ left: x, top: y, width: w, height: h, zIndex: z }}
			onMouseDown={onFocus}
			data-maximized={isMaximized}
		>
			<div className="retro-window-outer-bevel">
				<div className="retro-window-inner">
					<div
						className="retro-window-titlebar"
						onPointerDown={onTitlePointerDown}
						onPointerMove={onTitlePointerMove}
						onPointerUp={onTitlePointerUp}
						onPointerCancel={onTitlePointerUp}
						onDoubleClick={handleTitleBarDoubleClick}
						data-maximized={isMaximized}
					>
						<div className="retro-window-titlebar-content">
							<span className="retro-window-icon">{icon}</span>
							<span className="retro-window-title">{title}</span>
						</div>

						<div className="retro-window-controls">
							<button
								type="button"
								aria-label="Minimize window"
								className="retro-window-btn retro-window-btn-minimize"
								onClick={onMinimize}
							>
								<span>_</span>
							</button>
							<button
								type="button"
								aria-label={isMaximized ? "Restore window" : "Maximize window"}
								className="retro-window-btn retro-window-btn-maximize"
								onClick={handleMaximize}
							>
								<span>{isMaximized ? "❐" : "□"}</span>
							</button>
							<button
								type="button"
								aria-label="Close window"
								className="retro-window-btn retro-window-btn-close"
								onClick={onClose}
							>
								<span>×</span>
							</button>
						</div>
					</div>

					<div className="retro-window-menubar">
						<span className="retro-menu-item">File</span>
						<span className="retro-menu-item">Edit</span>
						<span className="retro-menu-item">View</span>
						<span className="retro-menu-item">Help</span>
					</div>

					<div className="retro-window-content-wrapper">
						<div className="retro-window-content">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
