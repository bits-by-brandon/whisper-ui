import { arch, platform } from '@tauri-apps/api/os';
import { appDataDir, join } from '@tauri-apps/api/path';
import { createDir, exists, writeBinaryFile } from '@tauri-apps/api/fs';
import { fetch, ResponseType } from '@tauri-apps/api/http';

type ModelDescriptor = {
        /**
         * The URL to download the model from.
         */
        url: string;
        /**
         * The file name the model should be stored as on disk.
         */
        fileName: string;
};

const DEFAULT_MODEL: ModelDescriptor = {
        url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin',
        fileName: 'ggml-base.en.bin'
};

const MODEL_BY_PLATFORM: Record<string, ModelDescriptor> = {
        'darwin-aarch64': DEFAULT_MODEL,
        'darwin-arm64': DEFAULT_MODEL,
        'darwin-x86_64': DEFAULT_MODEL,
        'linux-aarch64': DEFAULT_MODEL,
        'linux-arm': DEFAULT_MODEL,
        'linux-arm64': DEFAULT_MODEL,
        'linux-x86_64': DEFAULT_MODEL,
        'win32-arm64': DEFAULT_MODEL,
        'win32-ia32': DEFAULT_MODEL,
        'win32-x86_64': DEFAULT_MODEL
};

let cachedModelPath: string | null = null;
let inflightDownload: Promise<string> | null = null;

async function determineModelDescriptor(): Promise<ModelDescriptor> {
        const [currentPlatform, currentArch] = await Promise.all([platform(), arch()]);
        const descriptor = MODEL_BY_PLATFORM[`${currentPlatform}-${currentArch}`];
        return descriptor ?? DEFAULT_MODEL;
}

async function ensureModelFile(descriptor: ModelDescriptor): Promise<string> {
        const baseDir = await appDataDir();
        if (!baseDir) {
                throw new Error('Failed to determine application data directory for model download.');
        }
        const modelsDir = await join(baseDir, 'models');
        await createDir(modelsDir, { recursive: true });

        const modelPath = await join(modelsDir, descriptor.fileName);
        const fileExists = await exists(modelPath);
        if (!fileExists) {
                console.info(`Downloading Whisper model from ${descriptor.url}...`);
                const response = await fetch<Uint8Array>(descriptor.url, {
                        method: 'GET',
                        responseType: ResponseType.Binary
                });

                if (response.status >= 400 || !response.data) {
                        throw new Error(`Failed to download Whisper model: ${response.status} ${response.statusText}`);
                }

                await writeBinaryFile({ path: modelPath, contents: response.data });
                console.info(`Stored Whisper model at ${modelPath}`);
        }

        return modelPath;
}

/**
 * Ensures a Whisper model compatible with the current platform is available and
 * returns its absolute path on disk.
 */
export async function ensureModelForCurrentPlatform(): Promise<string> {
        if (cachedModelPath) return cachedModelPath;
        if (inflightDownload) return inflightDownload;

        inflightDownload = (async () => {
                const descriptor = await determineModelDescriptor();
                const path = await ensureModelFile(descriptor);
                cachedModelPath = path;
                inflightDownload = null;
                return path;
        })();

        return inflightDownload;
}

