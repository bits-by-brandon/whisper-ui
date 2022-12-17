import type { MediaFile } from '$lib/models/mediaFile';
import { writable, derived } from 'svelte/store';
import { loadTranscription } from '$lib/util/whisper';
import { create16bitWav, getDuration } from '$lib/util/ffmpeg';
import { createAudioUrlFromFile } from '$lib/util/files';
import { parseRawOutput } from '$lib/util/timecode';
import { save } from '$lib/util/persistance';
import { debounce } from '$lib/util/debounce';
import { playback } from './playback';

type Transcripts = {
	list: Map<string, Transcript>;
	loaded: boolean;
	active: string | null;
};

const createTranscripts = () => {
	const initialValue = {
		list: new Map<string, Transcript>(),
		loaded: false,
		active: null
	};
	const { subscribe, update, set } = writable<Transcripts>(initialValue);

	const createAudioBlobUrl = async (file: MediaFile) => {
		if (file.blobUrl) return;
		const blobUrl = await createAudioUrlFromFile(file);

		update((t) => {
			const found = t.list.get(file.path);
			if (!found) return t;
			found.file.blobUrl = blobUrl;
			return t;
		});
	};

	return {
		update,
		subscribe,
		set,
		createFromFile: async (file: MediaFile) => {
			update((t) => {
				if (t.list.has(file.path)) {
					console.info('Already uploaded this file');
					return t;
				}

				t.list.set(file.path, {
					file,
					name: file.name,
					status: 'empty',
					rawOutput: [],
					duration: null
				});
				return t;
			});

			transcripts.calculateDuration(file);
		},

		close: (file: MediaFile) => {
			update((t) => {
				t.list.delete(file.path);
				return t;
			});
		},

		setStatus: (file: MediaFile, status: Transcript['status']) => {
			update((t) => {
				const found = t.list.get(file.path);
				if (!found) return t;
				found.status = status;
				return t;
			});
		},

		setName: (file: MediaFile, name: string) => {
			update((t) => {
				const found = t.list.get(file.path);
				if (!found) return t;
				found.name = name;
				return t;
			});
		},

		setActive: (file: MediaFile) => {
			update((t) => {
				if (t.list.has(file.path)) {
					t.active = file.path;
				}
				return t;
			});
		},

		calculateDuration: async (file: MediaFile) => {
			try {
				const duration = await getDuration(file);

				update((t) => {
					const found = t.list.get(file.path);
					if (!found) return t;
					found.duration = duration;
					return t;
				});
			} catch (e) {
				console.error(e);
				update((t) => {
					const found = t.list.get(file.path);
					if (!found) return t;
					found.status = 'error';
					found.duration = 0;
					return t;
				});
			}
		},

		startTranscription: async (file: MediaFile) => {
			update((t) => {
				const found = t.list.get(file.path);
				if (!found) return t;
				found.status = 'transcribing';
				return t;
			});

			try {
				await create16bitWav(file);

				// Kick off creating the audio Blob Url but don't wait for it
				createAudioBlobUrl(file);

				const output = await loadTranscription(file);

				update((t) => {
					const found = t.list.get(file.path);
					if (!found) return t;
					found.status = 'transcribed';
					found.rawOutput = output;
					return t;
				});
			} catch (e) {
				console.log(e);
				update((t) => {
					const found = t.list.get(file.path);
					if (!found) return t;
					found.status = 'error';
					return t;
				});
			}
		},

		createAudioBlobUrl
	};
};

/**
 * Primary store for all transcripts
 */
export const transcripts = createTranscripts();

/**
 * The currently active transcript
 */
export const active = derived(transcripts, ($t) => {
	if (!$t.active) return null;
	playback.update(($p) => ({
		...$p,
		currentTime: 0
	}));
	return $t.list.get($t.active) || null;
});

/**
 * derived output store holds text value formatted for export
 */
export const output = derived(active, ($active) => {
	if (!$active) return { text: '', vtt: '' };
	const parsed = $active.rawOutput.map(parseRawOutput);
	return {
		text: parsed.map(({ text }) => text).join('\n'),
		vtt: `WEBVTT - ${$active.file.fileName}` + parsed.map(({ vtt }) => vtt).join()
	};
});

transcripts.subscribe(
	debounce((t: Transcripts) => {
		// only save after we load, or else we would override the existing save with empty data on boot
		if (t.loaded) save([...t.list.values()]);
	})
);
