import { MediaFile } from '$lib/models/mediaFile';
import { open } from '@tauri-apps/api/dialog';

export async function openMediaFile() {
	const opened = (await open({
		multiple: false,
		filters: [{ name: 'Audio', extensions: ['wav'] }]
	})) as string | null;

	if (!opened) throw new Error(`Could not open file`);
	return new MediaFile(opened);
}
