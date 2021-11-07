import { Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import useFlags from "../hooks/useFlags";
import MainLayout from "../layouts/MainLayout";
import FlagOverview from "../ui/FlagOverview";

const FlagPage: React.FC = () => {
    const { data: flags } = useFlags();

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
                        {flags && flags.map((flag) => <FlagOverview flag={flag} key={flag.id} />)}
                    </SimpleGrid>
                </Container>
            </MainLayout>
        </>
    );
};

export default FlagPage;
