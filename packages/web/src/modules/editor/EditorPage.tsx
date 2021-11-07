import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Flex,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import useFlags from "../hooks/useFlags";
import MainLayout from "../layouts/MainLayout";
import FlagOverview from "../ui/FlagOverview";

const EditorPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: flags } = useFlags();

    useEffect(() => {
        onOpen();
    }, []);

    return (
        <>
            <Flex flexDirection="column" height="100vh" background="gray.200">
                <MainLayout navbarSize="sm">
                    <Grid
                        height="100%"
                        templateColumns="20% auto 20%"
                        templateRows="auto 140px"
                        borderColor="gray.200"
                        borderTopWidth={1}
                    >
                        <GridItem colSpan={1} bg="white" borderColor="gray.200" borderEndWidth={1} boxShadow="lg" />

                        <GridItem
                            colStart={3}
                            colEnd={4}
                            bg="white"
                            borderColor="gray.200"
                            borderStartWidth={1}
                            boxShadow="lg"
                        />
                        <GridItem bg="white" colSpan={3} borderColor="gray.200" borderTopWidth={1} boxShadow="lg" />
                    </Grid>
                </MainLayout>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <IconButton
                            aria-label="back"
                            icon={<ArrowBackIcon />}
                            display="inline-block"
                            variant="unstyled"
                        />
                        <Heading size="md" display="inline-block">
                            pick a flag
                        </Heading>
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={[1, 2]} spacing={4}>
                            {flags && flags.map((flag) => <FlagOverview flag={flag} key={flag.id} />)}
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditorPage;
