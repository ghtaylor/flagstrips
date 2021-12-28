import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useEditorStore } from "../hooks/useEditor";
import { useFlag } from "../hooks/useQueryData";
import MainLayout from "../layouts/MainLayout";
import FlagComponent from "../ui/Flag";
import EditorEditPanel from "./EditorEditPanel";
import EditorOverviewPanel from "./EditorOverviewPanel";

const EditorPage: React.FC = () => {
    const router = useRouter();
    const { flagUid } = router.query;

    const { data: flag } = useFlag(flagUid as string, { enabled: typeof flagUid === "string" });
    const { selectedFlag, setSelectedFlag, selectedStripPosition } = useEditorStore();

    useEffect(() => {
        setSelectedFlag(flag);
    }, [flag]);

    //TODO: Can we use the above 'useFlag' hook in the 'useEditor' hook to retrieve the flag? Instead of here.

    return (
        <Flex flexDirection="column" height="100vh" background="gray.200" overflow="hidden">
            <MainLayout navbarSize="sm">
                <Grid
                    height="100%"
                    templateColumns="1fr 3fr 1fr"
                    templateRows="auto 140px"
                    borderColor="gray.200"
                    borderTopWidth={1}
                >
                    <GridItem
                        colSpan={1}
                        bg="white"
                        borderColor="gray.200"
                        borderEndWidth={1}
                        boxShadow="lg"
                        padding={3}
                        overflowY="scroll"
                    >
                        <EditorOverviewPanel />
                    </GridItem>
                    <GridItem colSpan={1} display="grid" placeItems="center">
                        {selectedFlag && (
                            <FlagComponent flag={selectedFlag} onlyShowStripPosition={selectedStripPosition} />
                        )}
                    </GridItem>
                    <GridItem
                        colSpan={1}
                        bg="white"
                        borderColor="gray.200"
                        borderStartWidth={1}
                        boxShadow="lg"
                        padding={3}
                    >
                        <EditorEditPanel />
                    </GridItem>
                    <GridItem bg="white" colSpan={3} borderColor="gray.200" borderTopWidth={1} boxShadow="lg" />
                </Grid>
            </MainLayout>
        </Flex>
    );
};

export default EditorPage;
