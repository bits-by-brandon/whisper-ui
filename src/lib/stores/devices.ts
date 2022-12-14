import { writable } from 'svelte/store';

type Devices = {
	availableDevices: MediaDeviceInfo[];
	selectedDevice: MediaDeviceInfo | null;
	modalOpen: boolean;
};

export const devices = writable<Devices>({
	availableDevices: [],
	selectedDevice: null,
	modalOpen: false
});
