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

export function timecodeToTimeData(matchArray: RegExpMatchArray): TimeData {
	const h = parseInt(matchArray[1]);
	const m = parseInt(matchArray[2]);
	const s = parseFloat(matchArray[3]);

	return {
		hours: h,
		minutes: m,
		seconds: s,
		hoursStr: h.toString().padStart(2, '0'),
		minutesStr: m.toString().padStart(2, '0'),
		secondsStr: s.toString().padStart(2, '0')
	};
}

export function timeDataToSeconds(time: TimeData) {
	return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function parseRawOutput(raw: string) {
	const timestampRegex = /(\d\d):(\d\d):(\d\d)/g;
	const timestamp = raw.substring(0, raw.indexOf(']'));
	const text = raw.substring(raw.indexOf(']') + 1);
	const match = [...timestamp.matchAll(timestampRegex)] || [];
	const start = timecodeToTimeData(match[0]);
	const end = timecodeToTimeData(match[1]);
	const vtt = `

${start.hoursStr}:${start.minutesStr}:${start.secondsStr} --> ${end.hoursStr}:${end.minutesStr}:${end.secondsStr}
- ${text}`;

	return {
		start,
		end,
		vtt,
		text,
		startSeconds: timeDataToSeconds(start),
		endSeconds: timeDataToSeconds(end)
	};
}
