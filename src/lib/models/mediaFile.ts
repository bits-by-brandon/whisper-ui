export class MediaFile {
	url: URL;

	constructor(path: string) {
		this.url = new URL('file://' + path);
	}

	get transformedWavFileName() {
		const [name] = this.fileName.split('.');
		return name + '-tmp.wav';
	}

	get extension() {
		const pathname = this.url.pathname;
		return pathname.substring(pathname.lastIndexOf('.'));
	}

	get fileName() {
		const pathname = this.url.pathname;
		return decodeURI(pathname.substring(pathname.lastIndexOf('/') + 1));
	}

	get path() {
		return decodeURI(this.url.pathname);
	}
}
