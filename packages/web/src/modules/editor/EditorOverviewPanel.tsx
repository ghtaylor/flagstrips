import { useDisclosure, Input, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { BiPencil } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { Strip } from "@flagstrips/common";
import { Reorder } from "framer-motion";
import { useEditorStore, selectedStripSelector } from "./useEditor";
import StripButton from "../ui/StripButton";

const EditorOverviewPanel: React.FC = () => {
    const {
        selectedFlag,
        setSelectedStripUid,
        updateSelectedFlag,
        createStrip,
        deleteStrip,
        setDraggingStripUid,
        reorderStrips,
        loading,
    } = useEditorStore();
    const selectedStrip = useEditorStore(selectedStripSelector);

    const [newFlagTitle, setNewFlagTitle] = useState<string | undefined>();
    const { isOpen: isEditingFlagTitle, onOpen: onEditFlagTitle, onClose: onStopEditFlagTitle } = useDisclosure();

    useEffect(() => {
        setNewFlagTitle(selectedFlag?.title);
    }, [isEditingFlagTitle, selectedFlag]);

    const handleStopEditFlagTitle = () => {
        if (newFlagTitle !== selectedFlag?.title) {
            updateSelectedFlag({ title: newFlagTitle });
        }
        onStopEditFlagTitle();
    };

    return selectedFlag ? (
        <>
            <Box>
                <Text textStyle="editorCaption">name</Text>
                {isEditingFlagTitle ? (
                    <FocusLock>
                        <Input
                            value={newFlagTitle}
                            onChange={({ target }) => setNewFlagTitle(target.value)}
                            onBlur={handleStopEditFlagTitle}
                            variant="flushed"
                            marginBottom={3}
                        />
                    </FocusLock>
                ) : (
                    <Flex alignItems="center" justifyContent="space-between" marginBottom={3}>
                        <Heading size="md" onClick={onEditFlagTitle}>
                            {selectedFlag.title}
                        </Heading>
                        <BiPencil size={24} />
                    </Flex>
                )}
            </Box>

            <Reorder.Group
                axis="y"
                layoutScroll
                values={selectedFlag.strips}
                onReorder={(strips: Strip[]) => reorderStrips(strips)}
            >
                {selectedFlag.strips.map((strip) => (
                    <Reorder.Item
                        value={strip}
                        key={strip.uid}
                        onDragStart={() => setDraggingStripUid(strip.uid)}
                        onDragEnd={() => setDraggingStripUid(undefined)}
                    >
                        <StripButton
                            strip={strip}
                            showDelete
                            size="lg"
                            marginBottom={2}
                            boxShadow="xl"
                            isActive={selectedStrip?.position === strip.position}
                            onClick={() => setSelectedStripUid(strip.uid)}
                            onDeleteClick={() => deleteStrip(strip.uid)}
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <StripButton
                showDelete={false}
                leftIcon={<HiPlus />}
                isLoading={loading.createStrip}
                justifyContent="center"
                size="lg"
                onClick={() => createStrip(selectedFlag.uid)}
            >
                add strip
            </StripButton>
        </>
    ) : (
        <></>
    );
};

export default EditorOverviewPanel;
