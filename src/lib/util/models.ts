import { arch, platform } from '@tauri-apps/api/os';
import { appDataDir, join } from '@tauri-apps/api/path';
import {
        createDir,
        exists,
        readTextFile,
        removeFile,
        writeBinaryFile,
        writeTextFile
} from '@tauri-apps/api/fs';
import { fetch, ResponseType } from '@tauri-apps/api/http';

export type WhisperModelLanguages = 'multilingual' | 'english';

export type WhisperModelDescriptor = {
        id: string;
        label: string;
        description: string;
        url: string;
        fileName: string;
        sizeBytes: number;
        languages: WhisperModelLanguages;
};

export type InstalledModel = {
        fileName: string;
        downloadedAt: string;
        sizeBytes: number;
};

type ModelManifest = {
        installed: Record<string, InstalledModel>;
        selectedModelId: string | null;
};

const MODELS_DIRECTORY_NAME = 'models';
const MANIFEST_FILE_NAME = 'manifest.json';
const DEFAULT_MODEL_ID = 'base.en';

const WHISPER_MODELS: WhisperModelDescriptor[] = [
        {
                id: 'tiny',
                label: 'Tiny',
                description: 'Fastest Whisper model with the lowest accuracy. Suitable for quick drafts or low-resource hardware.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin',
                fileName: 'ggml-tiny.bin',
                sizeBytes: 75530280,
                languages: 'multilingual'
        },
        {
                id: 'tiny.en',
                label: 'Tiny (English only)',
                description: 'Fast English-only model offering better accuracy than the multilingual Tiny while remaining lightweight.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin',
                fileName: 'ggml-tiny.en.bin',
                sizeBytes: 75128800,
                languages: 'english'
        },
        {
                id: 'base',
                label: 'Base',
                description: 'Balanced multilingual model with a good trade-off between accuracy and performance on most machines.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin',
                fileName: 'ggml-base.bin',
                sizeBytes: 142331104,
                languages: 'multilingual'
        },
        {
                id: 'base.en',
                label: 'Base (English only)',
                description: 'Recommended starting point for English transcription. Higher accuracy than Tiny models with moderate resource usage.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin',
                fileName: 'ggml-base.en.bin',
                sizeBytes: 141612464,
                languages: 'english'
        },
        {
                id: 'small',
                label: 'Small',
                description: 'Improved multilingual accuracy that requires a more capable CPU/GPU. Expect longer download times.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin',
                fileName: 'ggml-small.bin',
                sizeBytes: 466224960,
                languages: 'multilingual'
        },
        {
                id: 'small.en',
                label: 'Small (English only)',
                description: 'English-only variant of the Small model, offering higher quality for English recordings with reduced size.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin',
                fileName: 'ggml-small.en.bin',
                sizeBytes: 461391000,
                languages: 'english'
        },
        {
                id: 'medium',
                label: 'Medium',
                description: 'High-accuracy multilingual model suitable for powerful hardware. Downloads and inference take significantly longer.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin',
                fileName: 'ggml-medium.bin',
                sizeBytes: 1426404352,
                languages: 'multilingual'
        },
        {
                id: 'medium.en',
                label: 'Medium (English only)',
                description: 'English-only medium model delivering excellent accuracy for production workloads on capable machines.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin',
                fileName: 'ggml-medium.en.bin',
                sizeBytes: 1399584800,
                languages: 'english'
        },
        {
                id: 'large',
                label: 'Large V2',
                description: 'Highest accuracy multilingual Whisper model. Requires substantial disk space, memory, and compute resources.',
                url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v2.bin',
                fileName: 'ggml-large-v2.bin',
                sizeBytes: 2896998456,
                languages: 'multilingual'
        }
];

const RECOMMENDED_MODEL_BY_PLATFORM: Record<string, string> = {
        'darwin-aarch64': 'base.en',
        'darwin-arm64': 'base.en',
        'darwin-x86_64': 'base.en',
        'linux-aarch64': 'tiny',
        'linux-arm': 'tiny',
        'linux-arm64': 'tiny',
        'linux-x86_64': 'base',
        'win32-arm64': 'tiny',
        'win32-ia32': 'tiny',
        'win32-x86_64': 'base.en'
};

const cachedModelPaths = new Map<string, string>();
const inflightDownloads = new Map<string, Promise<string>>();

function getDescriptorById(modelId: string): WhisperModelDescriptor {
        const descriptor = WHISPER_MODELS.find((model) => model.id === modelId);
        if (!descriptor) {
                throw new Error(`Unknown Whisper model: ${modelId}`);
        }
        return descriptor;
}

async function getModelsDirectory(): Promise<string> {
        const baseDir = await appDataDir();
        if (!baseDir) {
                throw new Error('Failed to determine application data directory for model downloads.');
        }
        const modelsDir = await join(baseDir, MODELS_DIRECTORY_NAME);
        await createDir(modelsDir, { recursive: true });
        return modelsDir;
}

async function getManifestPath(): Promise<string> {
        const modelsDir = await getModelsDirectory();
        return join(modelsDir, MANIFEST_FILE_NAME);
}

async function loadManifest(): Promise<ModelManifest> {
        try {
                const manifestPath = await getManifestPath();
                if (await exists(manifestPath)) {
                        const contents = await readTextFile(manifestPath);
                        const parsed = JSON.parse(contents) as Partial<ModelManifest>;
                        return {
                                installed: parsed.installed ?? {},
                                selectedModelId: parsed.selectedModelId ?? null
                        };
                }
        } catch (error) {
                console.warn('Failed to read Whisper model manifest. Regenerating.', error);
        }

        return {
                installed: {},
                selectedModelId: null
        };
}

async function saveManifest(manifest: ModelManifest): Promise<void> {
        const manifestPath = await getManifestPath();
        await writeTextFile(manifestPath, JSON.stringify(manifest, null, 2));
}

async function resolveModelPath(modelId: string): Promise<string> {
        const descriptor = getDescriptorById(modelId);
        const modelsDir = await getModelsDirectory();
        return join(modelsDir, descriptor.fileName);
}

export function getAvailableModels(): WhisperModelDescriptor[] {
        return [...WHISPER_MODELS];
}

export async function getInstalledModels(): Promise<Record<string, InstalledModel>> {
        const manifest = await loadManifest();
        const cleanedEntries: Record<string, InstalledModel> = {};

        for (const [modelId, metadata] of Object.entries(manifest.installed)) {
                try {
                        const descriptor = getDescriptorById(modelId);
                        const modelPath = await resolveModelPath(modelId);
                        if (await exists(modelPath)) {
                                cleanedEntries[modelId] = {
                                        fileName: metadata.fileName ?? descriptor.fileName,
                                        downloadedAt: metadata.downloadedAt,
                                        sizeBytes: metadata.sizeBytes ?? descriptor.sizeBytes
                                };
                                cachedModelPaths.set(modelId, modelPath);
                        }
                } catch (error) {
                        console.warn(`Failed to verify installed model ${modelId}. Removing from manifest.`, error);
                }
        }

        if (Object.keys(cleanedEntries).length !== Object.keys(manifest.installed).length) {
                manifest.installed = cleanedEntries;
                await saveManifest(manifest);
        }

        return cleanedEntries;
}

export async function getSelectedModelId(): Promise<string | null> {
        const manifest = await loadManifest();
        return manifest.selectedModelId;
}

export async function selectModel(modelId: string): Promise<void> {
        const manifest = await loadManifest();
        if (!manifest.installed[modelId]) {
                throw new Error('Model must be downloaded before it can be selected.');
        }
        manifest.selectedModelId = modelId;
        await saveManifest(manifest);
}

export async function removeModel(modelId: string): Promise<void> {
        const manifest = await loadManifest();
        if (manifest.installed[modelId]) {
                try {
                        const modelPath = await resolveModelPath(modelId);
                        if (await exists(modelPath)) {
                                await removeFile(modelPath);
                        }
                } catch (error) {
                        console.error(`Failed to remove Whisper model ${modelId}`, error);
                }
                delete manifest.installed[modelId];
                cachedModelPaths.delete(modelId);
                if (manifest.selectedModelId === modelId) {
                        const remainingIds = Object.keys(manifest.installed);
                        manifest.selectedModelId = remainingIds.length > 0 ? remainingIds[0] : null;
                }
                await saveManifest(manifest);
        }
}

export async function getRecommendedModelId(): Promise<string> {
        const [currentPlatform, currentArch] = await Promise.all([platform(), arch()]);
        const descriptor = RECOMMENDED_MODEL_BY_PLATFORM[`${currentPlatform}-${currentArch}`];
        return descriptor ?? DEFAULT_MODEL_ID;
}

async function downloadDescriptor(descriptor: WhisperModelDescriptor): Promise<string> {
        const modelPath = await resolveModelPath(descriptor.id);
        const alreadyExists = await exists(modelPath);

        if (!alreadyExists) {
                console.info(`Downloading Whisper model from ${descriptor.url}...`);
                const response = await fetch<Uint8Array>(descriptor.url, {
                        method: 'GET',
                        responseType: ResponseType.Binary
                });

                if (response.status >= 400 || !response.data) {
                        const statusSuffix = 'statusText' in response && typeof (response as { statusText?: string }).statusText === 'string'
                                ? ` ${((response as { statusText?: string }).statusText as string).trim()}`
                                : '';
                        throw new Error(`Failed to download Whisper model: HTTP ${response.status}${statusSuffix}`);
                }

                await writeBinaryFile({ path: modelPath, contents: response.data });
                console.info(`Stored Whisper model at ${modelPath}`);
        }

        const manifest = await loadManifest();
        manifest.installed[descriptor.id] = {
                fileName: descriptor.fileName,
                downloadedAt: new Date().toISOString(),
                sizeBytes: descriptor.sizeBytes
        };
        if (!manifest.selectedModelId) {
                manifest.selectedModelId = descriptor.id;
        }
        await saveManifest(manifest);
        cachedModelPaths.set(descriptor.id, modelPath);
        return modelPath;
}

export async function downloadModel(modelId: string): Promise<string> {
        if (cachedModelPaths.has(modelId)) {
                return cachedModelPaths.get(modelId) as string;
        }
        if (inflightDownloads.has(modelId)) {
                return inflightDownloads.get(modelId) as Promise<string>;
        }

        const descriptor = getDescriptorById(modelId);
        const inflight = downloadDescriptor(descriptor).finally(() => {
                inflightDownloads.delete(modelId);
        });
        inflightDownloads.set(modelId, inflight);
        return inflight;
}

export async function ensureModelForCurrentPlatform(): Promise<string> {
        const manifest = await loadManifest();
        const recommended = await getRecommendedModelId();
        let preferredModelId = manifest.selectedModelId ?? recommended;
        let descriptor: WhisperModelDescriptor;

        try {
                descriptor = getDescriptorById(preferredModelId);
        } catch (error) {
                console.warn(`Preferred Whisper model ${preferredModelId} is not available. Falling back to ${recommended}.`);
                preferredModelId = recommended;
                descriptor = getDescriptorById(preferredModelId);
                manifest.selectedModelId = preferredModelId;
                await saveManifest(manifest);
        }
        const modelPath = await resolveModelPath(descriptor.id);

        if (manifest.installed[descriptor.id] && (await exists(modelPath))) {
                cachedModelPaths.set(descriptor.id, modelPath);
                return modelPath;
        }

        return downloadModel(descriptor.id);
}

