import {
    Flag,
    FlagPost,
    getStripIndexByUid,
    Strip,
    StripImagePost,
    StripPost,
    StripTextPost,
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
    draggingStripUid?: string;
    loading: EditorLoadingState;
}

const initialState: EditorState = {
    loading: {
        createStrip: false,
    },
};

const debouncedPatchFlagByUid = debounce((uid: string, flag: FlagPost) => {
    console.log("Submitting to API patch flag", uid, flag);
    patchFlagByUid(uid, flag);
}, 1500);

const debouncedPatchStripByUid = debounce((uid: string, strip: StripPost) => {
    console.log("Submitting to API patch strip", uid, strip);
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
        updateStrip: (stripUid: string, stripPost: StripPost) => {
            const { selectedFlag } = get();

            if (selectedFlag) {
                // If a new strip position was provided and it was out-of-bounds, raise exception.
                // Code will never cause this but check is worthwhile.
                if (
                    stripPost.position &&
                    (stripPost.position < 0 ||
                        stripPost.position > selectedFlag.strips[selectedFlag.strips.length - 1].position)
                )
                    throw new Error("Strip position provided is out of bounds.");

                const stripIndex = getStripIndexByUid(selectedFlag.strips, stripUid);
                const strip = selectedFlag.strips[stripIndex];
                // debouncedPatchStripByUid(stripUid, stripPost);
                return set((state) =>
                    produce(state, (draftState) => {
                        // If position has been updated, other strips positions need to be changed.
                        if (stripPost.position) {
                            /* eslint-disable @typescript-eslint/no-non-null-assertion */
                            // If new position is an increase compared to its current position.
                            if (stripPost.position > strip.position) {
                                const newStrips = selectedFlag.strips
                                    .map((_strip) => {
                                        if (_strip.uid === strip.uid)
                                            return merge({}, _strip, { position: stripPost.position });
                                        else if (
                                            _strip.position <= stripPost.position! &&
                                            _strip.position > strip.position
                                        )
                                            return merge({}, _strip, { position: _strip.position - 1 });
                                        else return _strip;
                                    })
                                    .sort((a, b) => a.position - b.position);

                                if (draftState.selectedFlag) draftState.selectedFlag.strips = newStrips;
                            }
                            // If new position is a decrease compared to its current position.
                            else if (stripPost.position < strip.position) {
                                const newStrips = selectedFlag.strips
                                    .map((_strip) => {
                                        if (_strip.uid === strip.uid)
                                            return merge({}, _strip, { position: stripPost.position });
                                        else if (
                                            _strip.position >= stripPost.position! &&
                                            _strip.position < strip.position
                                        )
                                            return merge({}, _strip, { position: _strip.position + 1 });
                                        else return _strip;
                                    })
                                    .sort((a, b) => a.position - b.position);

                                if (draftState.selectedFlag) draftState.selectedFlag.strips = newStrips;
                            }
                            /* eslint-enable @typescript-eslint/no-non-null-assertion */
                        }

                        // Finally, update strip with all stripPost properties.
                        if (draftState.selectedFlag)
                            draftState.selectedFlag.strips[stripIndex] = merge({}, strip, stripPost);
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
        setDraggingStripUid: (uid?: string) =>
            set((state) =>
                produce(state, (draftState) => {
                    draftState.draggingStripUid = uid;
                }),
            ),
        reorderStrips: (reorderedStrips: Strip[]) => {
            const { selectedFlag, draggingStripUid } = get();
            if (!draggingStripUid) throw new Error("lastDraggedStripUid must be set before reorder is called.");

            if (selectedFlag) {
                const newStrips = reorderedStrips.map((strip, index) => merge({}, strip, { position: index }));
                set((state) =>
                    produce(state, (draftState) => {
                        if (draftState.selectedFlag) draftState.selectedFlag.strips = newStrips;
                    }),
                );

                const changedStripIndex = reorderedStrips.findIndex(({ uid }) => uid === draggingStripUid);
                debouncedPatchStripByUid(reorderedStrips[changedStripIndex].uid, { position: changedStripIndex });
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
