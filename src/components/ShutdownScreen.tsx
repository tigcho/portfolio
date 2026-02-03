import { useState, useEffect } from "react";

type ShutdownPhase = "message" | "poweroff" | "done";

interface ShutdownScreenProps {
	onComplete: () => void;
}

export default function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
	const [phase, setPhase] = useState<ShutdownPhase>("message");

	useEffect(() => {
		if (phase === "message") {
			const timer = setTimeout(() => setPhase("poweroff"), 1500);
			return () => clearTimeout(timer);
		}
	}, [phase]);

	useEffect(() => {
		if (phase === "poweroff") {
			const timer = setTimeout(() => {
				setPhase("done");
				onComplete();
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [phase, onComplete]);

	if (phase === "done") return null;

	return (
		<div className={`shutdown-screen ${phase === "poweroff" ? "shutdown-collapse" : ""}`}>
			{phase === "message" && (
				<div className="shutdown-message">
					<div className="shutdown-text">Shutting down...</div>
				</div>
			)}
		</div>
	);
}
