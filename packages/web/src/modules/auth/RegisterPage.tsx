import { Button, Container, Flex, Heading, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import Head from "next/head";
import MainLayout from "../layouts/MainLayout";

const Register = (): JSX.Element => (
    <>
        <Head>
            <title>Register with Flaggin</title>
            <meta name="description" content="Create an account with Flaggin to show off your socials and sponsors." />
        </Head>

        <Flex height="100vh" flexDirection="column">
            <MainLayout>
                <Flex flex="auto" justifyContent="center" alignItems="center">
                    <Container
                        margin={6}
                        padding={6}
                        maxWidth={["container.sm", "container.sm", 500]}
                        background="white"
                        borderColor="gray.200"
                        borderWidth={1}
                        boxShadow="2xl"
                        borderRadius="lg"
                    >
                        <Heading size="md">register</Heading>
                        <InputGroup marginTop={6}>
                            <Input placeholder="username" />
                            <InputRightAddon>required</InputRightAddon>
                        </InputGroup>
                        <Input marginTop={3} placeholder="first name" />
                        <Input marginTop={3} placeholder="last name" />
                        <InputGroup marginTop={3}>
                            <Input placeholder="email" />
                            <InputRightAddon>required</InputRightAddon>
                        </InputGroup>
                        <InputGroup marginTop={3}>
                            <Input placeholder="password" />
                            <InputRightAddon>required</InputRightAddon>
                        </InputGroup>
                        <Button marginTop={6} width="100%">
                            register
                        </Button>
                    </Container>
                </Flex>
            </MainLayout>
        </Flex>
    </>
);

export default Register;
