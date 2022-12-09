import type { MediaFile } from '$lib/models/mediaFile';

export type Transcript = {
	file: MediaFile;
	rawOutput: string[];
	status: 'empty' | 'transcribing' | 'transcribed';
};
