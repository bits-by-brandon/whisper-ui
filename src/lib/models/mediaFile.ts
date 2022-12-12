export class MediaFile {
	url: URL;
	readonly transformedPath: string;
	blobUrl: string | null = null;
	originalPath: string;

	constructor(path: string, dir: string) {
		this.originalPath = path;
		this.url = new URL('file://' + path);
		this.transformedPath = dir + this.name + '-tmp.wav';
	}

	get name() {
		return this.fileName.split('.')[0];
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
