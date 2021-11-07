import { Box, Button, Container, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import Head from "next/head";
import MainLayout from "../layouts/MainLayout";

const LandingPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Flaggin</title>
                <meta name="description" content="Show off your socials and sponsors." />
            </Head>

            <MainLayout>
                <SimpleGrid as={Container} columns={2} alignItems="center" marginTop={24}>
                    <Box>
                        <Heading size="2xl" color="green.700" marginBottom={2}>
                            show off your socials and sponsors
                        </Heading>
                        <Text size="lg" fontWeight="semibold" color="green.500" lineHeight={7} marginBottom={8}>
                            name your socials and sponsors. throw in your colors. pick some snazzy animations. bosh it
                            on your video content. wallop.
                        </Text>
                        <Button size="lg" colorScheme="red">
                            Get started
                        </Button>
                    </Box>
                    <Image src="/landing.svg" />
                </SimpleGrid>
            </MainLayout>
        </>
    );
};

export default LandingPage;
