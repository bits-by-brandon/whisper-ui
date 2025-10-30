import type { MediaFile } from '$lib/models/mediaFile';
import { Command } from '@tauri-apps/api/shell';
import { ensureModelForCurrentPlatform } from './models';

/**
 * Runs the whisper model on a file and returns the output in vtt format
 */
export async function loadTranscription(file: MediaFile): Promise<string[]> {
        const modelPath = await ensureModelForCurrentPlatform();
	const transcribe = Command.sidecar('binaries/whisper', [
		'-m',
		modelPath,
		'-f',
		file.transformedPath
	]);
	const output: string[] = [];

	return new Promise((resolve, reject) => {
		transcribe.stderr.on('data', (error) => console.error(error));
		transcribe.stdout.on('data', (line) => {
			// Filter any empty lines
			if (line) output.push(line);
		});
		transcribe.on('error', reject);
		transcribe.on('close', () => resolve(output));
		transcribe.spawn();
	});
}
