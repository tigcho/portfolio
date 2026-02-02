"use client";

import { useEffect, useRef } from "react";
import "./styles/index.css";

export default function CRTContainer({ children }: { children: React.ReactNode }) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
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
	}, []);

	return (
		<div className="crt-root">
			<div className="crt-monitor">
				<div className="crt-bezel">
					<div className="crt-screen">
						<div className="crt-content" ref={overlayRef}>
							{children}
						</div>
						<div className="crt-scanlines" />
						<div className="crt-vignette" />
						<div className="crt-glass-highlight" />
						<div className="crt-rgb-shift" />
					</div>
				</div>
				{/* brand */}
				<div className="crt-brand">BOKATRON</div>
			</div>
		</div>
	);
}
