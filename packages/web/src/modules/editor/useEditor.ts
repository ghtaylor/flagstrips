import {
    Flag,
    FlagPost,
    StripPost,
    getStripIndexByUid,
    Strip,
    StripTextPost,
    StripImagePost,
} from "@flagstrips/common";
import produce from "immer";
import { cloneDeep, debounce, merge, omit, pick } from "lodash";
import create from "zustand";
import { combine } from "zustand/middleware";
import { deleteStripByUid, patchFlagByUid, patchStripByUid, postStrip } from "../providers/axios";
import { ApplyAllStyles } from "./util";

interface EditorLoadingState {
    createStrip: boolean;
}

interface EditorState {
    selectedFlag?: Flag;
    selectedStripUid?: string;
    loading: EditorLoadingState;
}

const initialState: EditorState = {
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
        setSelectedStripUid: (uid: string) =>
            set((state) =>
                produce(state, (draftState) => {
                    draftState.selectedStripUid = uid;
                }),
            ),
        setSelectedFlag: (flag?: Flag) => {
            const { selectedFlag } = get();
            set((state) =>
                produce(state, (draftState) => {
                    draftState.selectedFlag = flag;
                    if (flag && flag.uid !== selectedFlag?.uid && flag.strips.length > 0)
                        draftState.selectedStripUid = flag.strips[0].uid;
                }),
            );
        },
        updateSelectedFlag: (flagPost: FlagPost) => {
            const { selectedFlag } = get();
            if (selectedFlag) {
                debouncedPatchFlagByUid(selectedFlag.uid, flagPost);
                return set((state) =>
                    produce(state, (draftState) => {
                        draftState.selectedFlag = merge({}, selectedFlag, flagPost);
                    }),
                );
            }
        },
        updateSelectedStrip: (stripPost: StripPost) => {
            const { selectedFlag, selectedStripUid } = get();
            if (selectedFlag && selectedStripUid) {
                const stripIndex = getStripIndexByUid(selectedFlag.strips, selectedStripUid);
                const selectedStrip = cloneDeep(selectedFlag.strips[stripIndex]);
                debouncedPatchStripByUid(selectedStripUid, stripPost);
                return set((state) =>
                    produce(state, (draftState) => {
                        if (draftState.selectedFlag)
                            draftState.selectedFlag.strips[stripIndex] = merge({}, selectedStrip, stripPost);
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
                        if (draftState.selectedFlag?.uid === flagUid) {
                            draftState.selectedFlag.strips.push(strip);
                            draftState.selectedStripUid = strip.uid;
                        }
                    }),
                );
            }
        },
        deleteStrip: (stripUid: string) => {
            const { selectedFlag, selectedStripUid } = get();
            if (selectedFlag) {
                const selectedStripIndex = selectedStripUid
                    ? getStripIndexByUid(selectedFlag.strips, selectedStripUid)
                    : -1;
                const deletedStripIndex = getStripIndexByUid(selectedFlag.strips, stripUid);

                debouncedPatchStripByUid.cancel();

                deleteStripByUid(stripUid);

                return set((state) =>
                    produce(state, (draftState) => {
                        if (draftState.selectedFlag) {
                            draftState.selectedFlag.strips.splice(deletedStripIndex, 1);
                            draftState.selectedFlag.strips = draftState.selectedFlag.strips.map((strip) => {
                                if (strip.position > deletedStripIndex)
                                    return merge({}, strip, { position: strip.position - 1 });
                                return strip;
                            });

                            //First strip was deleted and was the selected one.
                            if (deletedStripIndex === selectedStripIndex) {
                                if (deletedStripIndex === 0)
                                    draftState.selectedStripUid = draftState.selectedFlag.strips[0].uid;
                                else if (draftState.selectedFlag.strips.length > 0)
                                    draftState.selectedStripUid =
                                        draftState.selectedFlag.strips[deletedStripIndex - 1].uid;
                                else draftState.selectedStripUid = undefined;
                            }
                        }
                    }),
                );
            }
        },
        applyStylesToAllStrips: (applyAllStyles: ApplyAllStyles) => {
            const { selectedFlag, selectedStripUid } = get();

            if (selectedFlag && selectedStripUid) {
                const stripIndex = getStripIndexByUid(selectedFlag.strips, selectedStripUid);
                const selectedStrip = cloneDeep(selectedFlag.strips[stripIndex]);
                return set((state) =>
                    produce(state, (draftState) => {
                        let flagPost: FlagPost;
                        switch (applyAllStyles.applyTo) {
                            case "text": {
                                let stripTextPost: StripTextPost = omit(selectedStrip.text, ["uid", "value"]);
                                stripTextPost = pick(stripTextPost, applyAllStyles.choices);
                                flagPost = {
                                    strips: selectedFlag.strips.map(({ uid }) => ({
                                        uid,
                                        text: stripTextPost,
                                    })),
                                };
                                break;
                            }
                            case "image": {
                                let stripImagePost: StripImagePost = omit(selectedStrip.image, ["uid", "imageOption"]);
                                stripImagePost = pick(stripImagePost, applyAllStyles.choices);
                                flagPost = {
                                    strips: selectedFlag.strips.map(({ uid }) => ({
                                        uid,
                                        image: stripImagePost,
                                    })),
                                };
                            }
                        }

                        patchFlagByUid(selectedFlag.uid, flagPost);

                        if (draftState.selectedFlag) {
                            draftState.selectedFlag.strips = merge([], selectedFlag.strips, flagPost.strips);
                        }
                    }),
                );
            }
        },
    })),
);

export const selectedStripSelector = ({ selectedFlag, selectedStripUid }: EditorState): Strip | undefined =>
    selectedFlag && selectedStripUid
        ? selectedFlag.strips[getStripIndexByUid(selectedFlag.strips, selectedStripUid)]
        : undefined;
