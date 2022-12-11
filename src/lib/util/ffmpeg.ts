import type { MediaFile } from '$lib/models/mediaFile';
import { Command } from '@tauri-apps/api/shell';

/**
 * Creates a 16 bit wav file to be ingested by the whisper model in a temp directory.
 */
export async function create16bitWav(file: MediaFile): Promise<void> {
	const ffmpeg = Command.sidecar('binaries/ffmpeg', [
		'-y',
		'-i',
		file.path,
		'-ar',
		'16000',
		'-ac',
		'1',
		'-c:a',
		'pcm_s16le',
		file.transformedPath
	]);

	const child = await ffmpeg.execute();
	if (child.code !== 0) {
		throw Error(`Could not transform file ${file.path}`);
	}
}

/**
 * Uses ffprobe to get the duration of the file in seconds or in HH:MM:SS timecode format
 */
export async function getDuration(
	file: MediaFile,
	format: 'seconds' | 'timecode' = 'seconds'
): Promise<number> {
	const args = [
		'-i',
		file.path,
		'-show_entries',
		'format=duration',
		'-of',
		'default=noprint_wrappers=1:nokey=1'
	];

	if (format === 'timecode') {
		args.push('-sexagesimal');
	}

	const ffprobe = Command.sidecar('binaries/ffprobe', args);
	let output = '';

	return new Promise((resolve, reject) => {
		ffprobe.stderr.on('data', (error) => console.error(error));
		ffprobe.stdout.on('data', (data) => (output += data));
		ffprobe.on('error', (error) => reject(error));
		ffprobe.on('close', () => resolve(parseFloat(output)));
		ffprobe.spawn();
	});
}
