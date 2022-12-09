import { execa } from 'execa';
import { renameSync } from 'fs';

let extension = '';
if (process.platform === 'win32') {
	extension = '.exe';
}

async function ensureDirectories() {
	await execa('mkdir', ['-p', 'src-tauri/binaries']);
	await execa('mkdir', ['-p', 'src-tauri/resources/models']);
}

async function buildWhisper() {
	await execa('make', undefined, { cwd: './whisper-cpp' });
}

function importModels() {
	renameSync('whisper-cpp/models/ggml-base.en.bin', 'src-tauri/resources/models/ggml-base.en.bin');
}

async function main() {
	await ensureDirectories();
	await buildWhisper();
	importModels();

	const rustInfo = (await execa('rustc', ['-vV'])).stdout;
	const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
	if (!targetTriple) {
		console.error('Failed to determine platform target triple');
	}
	renameSync(
		`whisper-cpp/main${extension}`,
		`src-tauri/binaries/whisper-${targetTriple}${extension}`
	);
}

main().catch((e) => {
	throw e;
});
