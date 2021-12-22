import { Flag, FlagPost, StripPost } from "@flagstrips/common";
import produce from "immer";
import { cloneDeep, debounce, merge } from "lodash";
import create from "zustand";
import { combine } from "zustand/middleware";
import { deleteStripByUid, getFlagByUid, patchFlagByUid, patchStripByUid, postStrip } from "../providers/axios";

interface EditorLoadingState {
    createStrip: boolean;
}

interface EditorState {
    selectedFlag?: Flag;
    selectedStripPosition: number;
    loading: EditorLoadingState;
}

const initialState: EditorState = {
    selectedStripPosition: 0,
    loading: {
        createStrip: false,
    },
};

const debouncedPatchFlagByUid = debounce((uid: string, flag: FlagPost) => {
    console.log("Submitting to API patch flag");
    patchFlagByUid(uid, flag);
}, 1500);

const debouncedPatchStripByUid = debounce((uid: string, strip: StripPost) => {
    console.log("Submitting to API patch strip");
    patchStripByUid(uid, strip);
}, 1500);

export const useEditorStore = create(
    combine(initialState, (set, get) => ({
        setSelectedStripPosition: (position: number) =>
            set((state) =>
                produce(state, (draftState) => {
                    draftState.selectedStripPosition = position;
                }),
            ),
        setSelectedFlag: (flag?: Flag) =>
            set((state) =>
                produce(state, (draftState) => {
                    draftState.selectedFlag = flag;
                }),
            ),
        updateSelectedFlag: (flagPost: FlagPost) => {
            const { selectedFlag } = get();
            if (selectedFlag) {
                debouncedPatchFlagByUid(selectedFlag.uid, flagPost);
                return set((state) =>
                    produce(state, (draftState) => {
                        draftState.selectedFlag = merge(selectedFlag, flagPost);
                    }),
                );
            }
        },
        updateSelectedStrip: (stripPost: StripPost) => {
            const { selectedFlag, selectedStripPosition } = get();
            if (selectedFlag) {
                debouncedPatchStripByUid(selectedFlag.strips[selectedStripPosition].uid, stripPost);
                return set((state) =>
                    produce(state, (draftState) => {
                        const selectedStrip = cloneDeep(selectedFlag.strips[selectedStripPosition]);
                        if (draftState.selectedFlag)
                            draftState.selectedFlag.strips[selectedStripPosition] = merge(selectedStrip, stripPost);
                    }),
                );
            }
        },
        createStrip: async (flagUid: string, stripPost?: StripPost) => {
            set((state) =>
                produce(state, (draftState) => {
                    draftState.loading.createStrip = true;
                }),
            );

            const strip = await postStrip(flagUid, stripPost);
            return set((state) =>
                produce(state, (draftState) => {
                    draftState.loading.createStrip = false;
                    if (draftState.selectedFlag) {
                        draftState.selectedFlag.strips.push(strip);
                    }
                }),
            );
        },
        deleteStrip: async (uid: string) => {
            const { selectedFlag } = get();
            debouncedPatchStripByUid.cancel();
            await deleteStripByUid(uid);
            if (selectedFlag) {
                try {
                    const flag = await getFlagByUid(selectedFlag.uid);
                    return set((state) =>
                        produce(state, (draftState) => {
                            draftState.selectedFlag = flag;
                        }),
                    );
                } catch (error) {
                    // Do nothing;
                }
            }
        },
    })),
);
