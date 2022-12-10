import type { MediaFile } from '$lib/models/mediaFile';
import { tempdir } from '@tauri-apps/api/os';
import { Command } from '@tauri-apps/api/shell';

export async function convertTo16bitWav(file: MediaFile): Promise<string> {
	const tempdirPath = await tempdir();
	const wavFile = tempdirPath + file.transformedWavFileName;

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
		wavFile
	]);

	return new Promise((resolve, reject) => {
		ffmpeg.stderr.on('data', (error) => console.error(error));
		ffmpeg.stdout.on('data', (data) => console.log(data));
		ffmpeg.on('error', (error) => reject(error));
		ffmpeg.on('close', () => resolve(wavFile));
		ffmpeg.spawn();
	});
}

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
