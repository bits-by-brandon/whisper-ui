import { MediaFile } from '$lib/models/mediaFile';
import { appCacheDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/api/dialog';
import { fs } from '@tauri-apps/api';

export const WAV_DIR = '16-bit-wav';
export const RECORDINGS_DIR = 'recordings';

export async function ensureWaveDir() {
	await fs.createDir(WAV_DIR, {
		dir: fs.BaseDirectory.AppCache,
		recursive: true
	});
}

export async function ensureRecordingDir() {
	await fs.createDir(RECORDINGS_DIR, {
		dir: fs.BaseDirectory.AppCache,
		recursive: true
	});
}

export async function getWaveDir() {
	return (await appCacheDir()) + WAV_DIR + '/';
}

export async function getRecordingsDir() {
	return (await appCacheDir()) + RECORDINGS_DIR + '/';
}

export async function openMediaFile() {
	const opened = (await open({
		multiple: false,
		filters: [
			{
				name: 'Media',
				extensions: ['wav', 'mp3', 'aif', 'mp4', 'aac', 'mov', 'wmv', 'avi', 'webm']
			}
		]
	})) as string | null;

	if (!opened) throw new Error(`Could not open file`);

	return MediaFile.create(opened);
}