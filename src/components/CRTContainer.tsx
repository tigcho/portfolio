"use client";

import { useEffect, useRef } from "react";
import "../styles/index.css";

interface CRTContainerProps {
	children: React.ReactNode;
	isPoweredOn: boolean;
	onPowerToggle: () => void;
}

export default function CRTContainer({
	children,
	isPoweredOn,
	onPowerToggle
}: CRTContainerProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isPoweredOn) return;

		const startTime = performance.now();
		let animationId: number;

		const animate = () => {
			const time = (performance.now() - startTime) / 1000;

			if (overlayRef.current) {
				const flicker = 0.97 + 0.03 * Math.sin(time * 8) * Math.sin(time * 13);
				overlayRef.current.style.setProperty("--flicker", flicker.toString());
			}

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animationId);
	}, [isPoweredOn]);

	return (
		<div className="crt-root">
			<div className="crt-monitor">
				<div className="crt-bezel">
					<div className={`crt-screen ${!isPoweredOn ? "crt-screen-off" : ""}`}>
						{isPoweredOn && (
							<div className="crt-content" ref={overlayRef}>
								{children}
							</div>
						)}
						<div className="crt-scanlines" />
						<div className="crt-vignette" />
						<div className="crt-glass-highlight" />
						<div className="crt-rgb-shift" />
					</div>
				</div>
				<div className="crt-controls">
					<div className={`crt-led ${isPoweredOn ? "crt-led-on" : "crt-led-off"}`} />
					<button
						className="crt-power-button"
						onClick={onPowerToggle}
						aria-label={isPoweredOn ? "Turn off monitor" : "Turn on monitor"}
					>
						<span className="crt-power-icon">⏻</span>
					</button>
				</div>
				<div className="crt-brand">BOKATRON</div>
			</div>
		</div>
	);
}
