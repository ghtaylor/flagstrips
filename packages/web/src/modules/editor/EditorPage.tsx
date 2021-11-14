import { Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useFlag } from "../hooks/useFlags";
import MainLayout from "../layouts/MainLayout";

const EditorPage: React.FC = () => {
    const router = useRouter();
    const { flagUid } = router.query;
    const { error, data: flag } = useFlag(flagUid as string);

    return (
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
                    {flag && <Heading>{flag.title}</Heading>}
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
    );
};

export default EditorPage;
