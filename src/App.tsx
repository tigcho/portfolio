import { useState, useCallback } from 'react';
import CRTContainer from './components/CRTContainer';
import Desktop from './desktop/Desktop';
import BootScreen from './components/BootScreen';
import ShutdownScreen from './components/ShutdownScreen';

type PowerState = "off" | "booting" | "on" | "shutting_down";

export default function App() {
	const [powerState, setPowerState] = useState<PowerState>("booting");

	const handleBootComplete = useCallback(() => {
		setPowerState("on");
	}, []);

	const handleShutdownComplete = useCallback(() => {
		setPowerState("off");
	}, []);

	const handlePowerToggle = useCallback(() => {
		if (powerState === "off") {
			setPowerState("booting");
		} else if (powerState === "on") {
			setPowerState("shutting_down");
		}
	}, [powerState]);

	const isPoweredOn = powerState !== "off";

	return (
		<CRTContainer isPoweredOn={isPoweredOn} onPowerToggle={handlePowerToggle}>
			{powerState === "booting" && (
				<BootScreen onComplete={handleBootComplete} />
			)}
			{powerState === "on" && <Desktop />}
			{powerState === "shutting_down" && (
				<ShutdownScreen onComplete={handleShutdownComplete} />
			)}
		</CRTContainer>
	);
}
