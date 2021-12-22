import { Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useFlags } from "../hooks/useQueryData";
import MainLayout from "../layouts/MainLayout";
import FlagOverview from "../ui/FlagOverview";

const FlagPage: React.FC = () => {
    const { data: flags } = useFlags();

    useEffect(() => {
        console.log(flags);
    }, [flags]);

    return (
        <>
            <Head>
                <title>Flaggin - My Flags</title>
            </Head>

            <MainLayout>
                <Container marginTop={8}>
                    <Heading size="md" marginBottom={6}>
                        my flags
                    </Heading>
                    <SimpleGrid columns={[1, 2, 4]} spacing={4}>
                        {flags &&
                            flags.map((flag) => (
                                <FlagOverview flag={flag} key={flag.uid} editHref={(flag) => `/editor/${flag.uid}`} />
                            ))}
                    </SimpleGrid>
                </Container>
            </MainLayout>
        </>
    );
};

export default FlagPage;
