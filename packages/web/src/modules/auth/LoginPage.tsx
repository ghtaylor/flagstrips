import { Button, Container, Flex, Heading, Input } from "@chakra-ui/react";
import { UserLogin } from "@flagstrips/common";
import { Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import isEmail from "validator/lib/isEmail";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "./AuthProvider";

interface LoginForm {
    emailOrUsername: string;
    password: string;
}

const initialFormValues: LoginForm = {
    emailOrUsername: "",
    password: "",
};

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const { push } = useRouter();

    const onFormSubmit = async ({ emailOrUsername, password }: LoginForm) => {
        try {
            const userLogin: UserLogin = isEmail(emailOrUsername)
                ? { email: emailOrUsername, password }
                : { username: emailOrUsername, password };

            await login(userLogin);
            push("/");
            return;
        } catch (error) {
            console.log("not successful");
        }
    };

    return (
        <>
            <Head>
                <title>login to flaggin</title>
                <meta
                    name="description"
                    content="Create an account with Flaggin to show off your socials and sponsors."
                />
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
                            <Heading size="md">login</Heading>
                            <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
                                {({ values, handleChange, handleBlur, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Input
                                            marginTop={6}
                                            name="emailOrUsername"
                                            placeholder="email or username"
                                            type="text"
                                            value={values.emailOrUsername}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Input
                                            marginTop={3}
                                            name="password"
                                            placeholder="password"
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Button marginTop={6} width="100%" type="submit">
                                            login
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                            <Button marginTop={6} width="100%" colorScheme="facebook" leftIcon={<FaFacebook />}>
                                continue with facebook
                            </Button>
                            <Button
                                marginTop={3}
                                width="100%"
                                colorScheme="white"
                                background="black"
                                leftIcon={<FaApple />}
                            >
                                continue with apple
                            </Button>
                            <Button
                                marginTop={3}
                                width="100%"
                                colorScheme="gray"
                                background="white"
                                boxShadow="base"
                                leftIcon={<FcGoogle />}
                            >
                                continue with google
                            </Button>
                        </Container>
                    </Flex>
                </MainLayout>
            </Flex>
        </>
    );
};

export default LoginPage;
