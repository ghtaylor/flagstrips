import { Flag, FlagPost, StripPost } from "@flagstrips/common";
import produce from "immer";
import { cloneDeep, debounce, merge } from "lodash";
import create from "zustand";
import { combine } from "zustand/middleware";
import { deleteStripByUid, patchFlagByUid, patchStripByUid, postStrip } from "../providers/axios";

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
            const { selectedFlag } = get();
            if (selectedFlag) {
                set((state) =>
                    produce(state, (draftState) => {
                        draftState.loading.createStrip = true;
                    }),
                );

                const strip = await postStrip(flagUid, stripPost);

                return set((state) =>
                    produce(state, (draftState) => {
                        draftState.loading.createStrip = false;
                        if (draftState.selectedFlag?.uid === flagUid) draftState.selectedFlag.strips.push(strip);
                    }),
                );
            }
        },
        deleteStrip: (stripUid: string) => {
            const { selectedFlag, selectedStripPosition } = get();
            if (selectedFlag) {
                const deletedStripPosition = selectedFlag.strips.findIndex(({ uid }) => uid === stripUid);
                const deletedStrip = selectedFlag.strips[deletedStripPosition];

                debouncedPatchStripByUid.cancel();
                deleteStripByUid(stripUid).catch(() =>
                    set((state) =>
                        produce(state, (draftState) => {
                            if (draftState.selectedFlag) {
                                draftState.selectedFlag.strips.splice(deletedStripPosition, 0, deletedStrip);
                                draftState.selectedFlag.strips = draftState.selectedFlag.strips.map((strip) => {
                                    if (strip.position >= deletedStripPosition)
                                        return merge(strip, { position: strip.position + 1 });
                                    return strip;
                                });
                            }
                        }),
                    ),
                );

                return set((state) =>
                    produce(state, (draftState) => {
                        if (draftState.selectedFlag) {
                            if (deletedStripPosition === selectedFlag.strips.length - 1) {
                                draftState.selectedStripPosition = selectedStripPosition - 1;
                            }

                            draftState.selectedFlag.strips.splice(deletedStripPosition, 1);
                            draftState.selectedFlag.strips = draftState.selectedFlag.strips.map((strip) => {
                                if (strip.position > deletedStripPosition)
                                    return merge(strip, { position: strip.position - 1 });
                                return strip;
                            });
                        }
                    }),
                );
            }
        },
    })),
);
