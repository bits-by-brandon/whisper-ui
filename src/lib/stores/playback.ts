import { writable } from 'svelte/store';

type Playback = {
	currentTime: number;
	paused: boolean;
};

export const playback = writable<Playback>({
	currentTime: 0,
	paused: true
});