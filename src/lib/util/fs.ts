import { MediaFile } from '$lib/models/mediaFile';
import { appCacheDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/api/dialog';
import { fs } from '@tauri-apps/api';

export async function openMediaFile() {
	const opened = (await open({
		multiple: false,
		filters: [{ name: 'Audio', extensions: ['wav'] }]
	})) as string | null;

	if (!opened) throw new Error(`Could not open file`);
	await fs.createDir('16-bit-wav', {
		dir: fs.BaseDirectory.AppCache,
		recursive: true
	});
	const dir = await appCacheDir();

	return new MediaFile(opened, dir);
}
