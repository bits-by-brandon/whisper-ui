// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {}

type TimeData = {
	hours: number;
	minutes: number;
	seconds: number;
	hoursStr: string;
	minutesStr: string;
	secondsStr: string;
};

type Transcript = {
	file: MediaFile;
	rawOutput: string[];
	name: string;
	status: 'empty' | 'transcribing' | 'transcribed' | 'error';
	duration: number | null;
};
