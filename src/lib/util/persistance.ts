import { MediaFile } from '$lib/models/mediaFile';
import { transcripts } from '$lib/stores/transcripts';
import { fs } from '@tauri-apps/api';
import { appCacheDir } from '@tauri-apps/api/path';
import { ensureWaveDir, getWaveDir } from './fs';

const SAVE_FILE = 'save-data.json';

export async function save(transcripts: Transcript[]) {
	const data = JSON.stringify(transcripts);
	const cacheDir = await appCacheDir();
	return fs.writeTextFile(cacheDir + SAVE_FILE, data);
}

export async function load() {
	const cacheDir = await appCacheDir();
	try {
		await ensureWaveDir();
		const waveDir = await getWaveDir();
		const text = await fs.readTextFile(cacheDir + SAVE_FILE);
		const data = JSON.parse(text);
		const transformed = data.map((transcript: any) => {
			const file = new MediaFile(transcript.file.originalPath, waveDir);
			// Kick off creating the audio Blob Url but don't wait for it
			return [file.path, { ...transcript, file }];
		}) as [string, Transcript][];

		transcripts.update((t) => {
			t.list = new Map(transformed);
			t.loaded = true;
			return t;
		});

		// Start generating audio blobs
		transformed.forEach(([_, t]) => {
			transcripts.createAudioBlobUrl(t.file);
		});
	} catch {
		console.info('No available cache');
		transcripts.update((t) => {
			t.loaded = true;
			return t;
		});
	}
}
