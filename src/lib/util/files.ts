import type { MediaFile } from '$lib/models/mediaFile';
import { readBinaryFile } from '@tauri-apps/api/fs';

export async function createAudioUrl(file: MediaFile) {
	const bin = await readBinaryFile(file.transformedPath);
	const blob = new Blob([bin], { type: 'audio/wav' });
	return window.URL.createObjectURL(blob);
}
