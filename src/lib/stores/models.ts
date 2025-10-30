import { writable } from 'svelte/store';
import type { InstalledModel, WhisperModelDescriptor } from '$lib/util/models';
import {
        downloadModel as downloadModelFile,
        getAvailableModels,
        getInstalledModels,
        getRecommendedModelId,
        getSelectedModelId,
        removeModel as removeModelFile,
        selectModel as selectModelFile
} from '$lib/util/models';

export type ModelsStoreState = {
        available: WhisperModelDescriptor[];
        installed: Partial<Record<string, InstalledModel>>;
        selectedModelId: string | null;
        recommendedModelId: string | null;
        downloading: Partial<Record<string, boolean>>;
        removing: Partial<Record<string, boolean>>;
        loading: boolean;
        error: string | null;
};

const initialState: ModelsStoreState = {
        available: getAvailableModels(),
        installed: {},
        selectedModelId: null,
        recommendedModelId: null,
        downloading: {},
        removing: {},
        loading: false,
        error: null
};

function createModelsStore() {
        const { subscribe, update, set } = writable<ModelsStoreState>({ ...initialState });

        async function refresh() {
                update((state) => ({ ...state, loading: true, error: null }));

                try {
                        const [installed, selectedModelId, recommendedModelId] = await Promise.all([
                                getInstalledModels(),
                                getSelectedModelId(),
                                getRecommendedModelId()
                        ]);

                        set({
                                ...initialState,
                                installed,
                                selectedModelId,
                                recommendedModelId,
                                loading: false,
                                error: null
                        });
                } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        update((state) => ({
                                ...state,
                                loading: false,
                                error: message
                        }));
                }
        }

        async function download(modelId: string) {
                update((state) => ({
                        ...state,
                        downloading: { ...state.downloading, [modelId]: true },
                        error: null
                }));

                try {
                        await downloadModelFile(modelId);
                        await refresh();
                } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        update((state) => ({
                                ...state,
                                downloading: { ...state.downloading, [modelId]: false },
                                error: message
                        }));
                }
        }

        async function remove(modelId: string) {
                update((state) => ({
                        ...state,
                        removing: { ...state.removing, [modelId]: true },
                        error: null
                }));

                try {
                        await removeModelFile(modelId);
                        await refresh();
                } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        update((state) => ({
                                ...state,
                                removing: { ...state.removing, [modelId]: false },
                                error: message
                        }));
                }
        }

        async function select(modelId: string) {
                try {
                        await selectModelFile(modelId);
                        update((state) => ({
                                ...state,
                                selectedModelId: modelId,
                                error: null
                        }));
                } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        update((state) => ({
                                ...state,
                                error: message
                        }));
                }
        }

        function clearError() {
                update((state) => ({
                        ...state,
                        error: null
                }));
        }

        return {
                subscribe,
                refresh,
                download,
                remove,
                select,
                clearError
        };
}

export const models = createModelsStore();
