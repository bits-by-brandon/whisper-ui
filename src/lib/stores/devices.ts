import { writable } from 'svelte/store';

type Devices = {
	availableDevices: MediaDeviceInfo[];
	selectedDevice: MediaDeviceInfo | null;
};

export const devices = writable<Devices>({
	availableDevices: [],
	selectedDevice: null
});
