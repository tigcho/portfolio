import { useState } from "react";
import CRTContainer from "./components/CRTContainer";
import Desktop from "./desktop/Desktop";
import BootScreen from "./components/BootScreen";
import ShutdownScreen from "./components/ShutdownScreen";

type PowerState = "off" | "booting" | "on" | "shutting_down";

export default function App() {
	const [powerState, setPowerState] = useState<PowerState>("booting");

	return (
		<CRTContainer
			isPoweredOn={powerState !== "off"}
			onPowerToggle={() =>
				setPowerState((s) =>
					s === "off" ? "booting" : s === "on" ? "shutting_down" : s
				)
			}
		>
			{powerState === "booting" && (
				<BootScreen onComplete={() => setPowerState("on")} />
			)}
			{powerState === "on" && <Desktop />}
			{powerState === "shutting_down" && (
				<ShutdownScreen onComplete={() => setPowerState("off")} />
			)}
		</CRTContainer>
	);
}
