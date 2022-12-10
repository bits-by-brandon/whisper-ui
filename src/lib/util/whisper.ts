import { resolveResource } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/api/shell';

export async function loadTranscription(filepath: string): Promise<string[]> {
	const modelPath = await resolveResource('resources/models/ggml-base.en.bin');
	const transcribe = await Command.sidecar('binaries/whisper', ['-m', modelPath, '-f', filepath]);
	const output: string[] = [];

	return new Promise((resolve, reject) => {
		transcribe.stderr.on('data', (error) => console.error(error));
		transcribe.stdout.on('data', (line) => output.push(line));
		transcribe.on('error', (error) => reject(error));
		transcribe.on('close', () => resolve(output.filter(Boolean)));
		transcribe.spawn();
	});
}
