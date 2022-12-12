// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {}

type Transcript = {
	file: MediaFile;
	rawOutput: string[];
	status: 'empty' | 'transcribing' | 'transcribed' | 'error';
	duration: number | null;
};
