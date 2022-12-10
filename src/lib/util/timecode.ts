export function secondsToTimecode(seconds: number) {
	const HOUR = 3600;
	const MINUTE = 60;
	let h = 0;
	while (seconds > HOUR) {
		h++;
		seconds -= HOUR;
	}

	let m = 0;
	while (seconds > MINUTE) {
		m++;
		seconds -= MINUTE;
	}

	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}
