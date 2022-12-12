import { writable } from 'svelte/store';

type Playback = {
	currentTime: number;
};

export const playback = writable<Playback>({
	currentTime: 0
});

