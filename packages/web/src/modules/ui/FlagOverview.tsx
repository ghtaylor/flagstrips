import {
    Box,
    Button,
    ComponentWithAs,
    Flex,
    FlexProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { Flag } from "@flagstrips/common";
import { useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import StripOverview from "./StripOverview";

interface FlagOverviewProps {
    flag: Flag;
    onDelete?: (flag: Flag) => void;
    editHref?: (flag: Flag) => string;
    previewHref?: (flag: Flag) => string;
}

const FlagOverview: ComponentWithAs<"article", FlexProps & FlagOverviewProps> = ({
    flag,
    onDelete,
    editHref,
    previewHref,
    ...props
}) => {
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    const deleteButtonRef = useRef(null);

    return (
        <>
            <Flex
                as="article"
                flexDirection="column"
                borderColor="gray.200"
                borderWidth={1}
                borderRadius="md"
                {...props}
            >
                <Box padding={2}>
                    {flag.strips.slice(0, 3).map((strip, index) => (
                        <StripOverview
                            key={strip.uid}
                            strip={strip}
                            marginBottom={index === flag.strips.length - 1 ? 0 : 1}
                        />
                    ))}
                    {flag.strips.length > 3 && <StripOverview>{flag.strips.length - 3} more...</StripOverview>}
                </Box>
                <Flex flexDirection="column" padding={2} marginTop="auto" borderColor="gray.200" borderTopWidth={1}>
                    <Text size="sm" fontWeight="semibold" paddingBottom={6}>
                        {flag.title}
                    </Text>
                    <Flex>
                        <Button size="xs" marginEnd={1} as="a" href={editHref ? editHref(flag) : undefined}>
                            edit
                        </Button>
                        <Button
                            size="xs"
                            colorScheme="gray"
                            variant="outline"
                            as="a"
                            href={previewHref ? previewHref(flag) : undefined}
                        >
                            preview
                        </Button>

                        <Menu>
                            <MenuButton
                                as={Button}
                                aria-label="More"
                                size="xs"
                                colorScheme="gray"
                                variant="outline"
                                marginStart="auto"
                            >
                                ...
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={() => (onDelete ? onDeleteModalOpen() : undefined)}
                                >
                                    delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Flex>

            {onDelete && (
                <Modal
                    initialFocusRef={deleteButtonRef}
                    onClose={onDeleteModalClose}
                    isOpen={isDeleteModalOpen}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>are you sure?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody paddingY={0}>this flag will be permanently deleted.</ModalBody>
                        <ModalFooter>
                            <Button
                                ref={deleteButtonRef}
                                colorScheme="red"
                                onClick={() => {
                                    onDeleteModalClose();
                                    onDelete(flag);
                                }}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default FlagOverview;
