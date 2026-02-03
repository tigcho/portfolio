import { useState, useEffect } from "react";

type BootPhase = "turnon" | "bios" | "loading" | "welcome" | "done";

interface BootScreenProps {
	onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
	const [phase, setPhase] = useState<BootPhase>("turnon");
	const [biosLines, setBiosLines] = useState<string[]>([]);
	const [loadingProgress, setLoadingProgress] = useState(0);

	const biosText = [
		"BOKATRON BIOS v1.0",
		"Copyright (C) 2026 Tigcho",
		"",
		"CPU: Libertadorus III 450MHz",
		"Memory Test: 64MB OK",
		"",
		"Detecting Primary Master... Hard Disk",
		"Detecting Primary Slave... None",
		"Detecting Secondary Master... CD-ROM",
		"",
		"Starting Portfolio OS...",
	];

	useEffect(() => {
		if (phase === "turnon") {
			const timer = setTimeout(() => setPhase("bios"), 600);
			return () => clearTimeout(timer);
		}
	}, [phase]);

	useEffect(() => {
		if (phase === "bios") {
			let lineIndex = 0;
			const interval = setInterval(() => {
				if (lineIndex < biosText.length) {
					setBiosLines((prev) => [...prev, biosText[lineIndex]]);
					lineIndex++;
				} else {
					clearInterval(interval);
					setTimeout(() => setPhase("loading"), 500);
				}
			}, 150);
			return () => clearInterval(interval);
		}
	}, [phase]);

	useEffect(() => {
		if (phase === "loading") {
			const interval = setInterval(() => {
				setLoadingProgress((prev) => {
					if (prev >= 100) {
						clearInterval(interval);
						setTimeout(() => setPhase("welcome"), 300);
						return 100;
					}
					// Random increment for realistic feel
					return Math.min(prev + Math.random() * 15 + 5, 100);
				});
			}, 200);
			return () => clearInterval(interval);
		}
	}, [phase]);

	useEffect(() => {
		if (phase === "welcome") {
			const timer = setTimeout(() => {
				setPhase("done");
				onComplete();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [phase, onComplete]);

	if (phase === "done") return null;

	return (
		<div className={`boot-screen ${phase === "turnon" ? "boot-turnon" : ""}`}>
			{phase === "turnon" && <div className="boot-turnon-effect" />}

			{phase === "bios" && (
				<div className="boot-bios">
					{biosLines.map((line, i) => (
						<div key={i} className="boot-bios-line">
							{line}
						</div>
					))}
					<span className="boot-cursor">_</span>
				</div>
			)}

			{phase === "loading" && (
				<div className="boot-loading">
					<div className="boot-logo">
						<div className="boot-logo-text">Portfolio</div>
						<div className="boot-logo-subtext">95</div>
					</div>
					<div className="boot-progress-container">
						<div
							className="boot-progress-bar"
							style={{ width: `${loadingProgress}%` }}
						/>
					</div>
					<div className="boot-loading-text">Loading system files...</div>
				</div>
			)}

			{phase === "welcome" && (
				<div className="boot-welcome">
					<div className="boot-welcome-text">Welcome</div>
				</div>
			)}
		</div>
	);
}
