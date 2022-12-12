export function debounce(fn: (...a: any) => any, timeDelay = 1500) {
	let fnTimer: any = 0;
	return (...args: any) => {
		clearTimeout(fnTimer);
		fnTimer = setTimeout(fn(...args), timeDelay);
	};
}
