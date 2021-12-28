import { Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { useCreateFlag, useDeleteFlag, useFlags } from "../hooks/useQueryData";
import MainLayout from "../layouts/MainLayout";
import AddFlagButton from "../ui/AddFlagButton";
import FlagOverview from "../ui/FlagOverview";

const FlagPage: React.FC = () => {
    const { data: flags } = useFlags();
    const { mutate: createFlag } = useCreateFlag();
    const { mutate: deleteFlag } = useDeleteFlag();

    return (
        <>
            <Head>
                <title>Flaggin - My Flags</title>
            </Head>

            <MainLayout>
                <Container marginY={8}>
                    <Heading size="md" marginBottom={6}>
                        my flags
                    </Heading>
                    <SimpleGrid columns={[1, 2, 4]} spacing={4}>
                        {flags &&
                            flags.map((flag) => (
                                <FlagOverview
                                    flag={flag}
                                    key={flag.uid}
                                    onDelete={(flag) => deleteFlag(flag.uid)}
                                    editHref={(flag) => `/editor/${flag.uid}`}
                                    minHeight={248}
                                />
                            ))}
                        <AddFlagButton onClick={() => createFlag(undefined)} />
                    </SimpleGrid>
                </Container>
            </MainLayout>
        </>
    );
};

export default FlagPage;
