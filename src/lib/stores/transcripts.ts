import type { MediaFile } from '$lib/models/mediaFile';
import type { Transcript } from '$lib/models/transcript';
import { writable, derived } from 'svelte/store';
import { loadTranscription } from '$lib/util/whisper';
import { create16bitWav, getDuration } from '$lib/util/ffmpeg';

type Transcripts = {
	list: Map<string, Transcript>;
	active: string | null;
};

const createTranscripts = () => {
	const initialValue = {
		list: new Map<string, Transcript>(),
		active: null
	};
	const { subscribe, update, set } = writable<Transcripts>(initialValue);

	return {
		subscribe,
		set,
		createFromFile: async (file: MediaFile) => {
			update((t) => {
				if (t.list.has(file.path)) throw new Error('[info] Already uploaded this file');
				t.list.set(file.path, {
					file,
					status: 'empty',
					rawOutput: [],
					duration: null
				});
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
		}
	};
};

export const transcripts = createTranscripts();

export const active = derived(transcripts, ($t) => {
	if (!$t.active) return null;
	return $t.list.get($t.active) || null;
});
