import { ChakraProvider } from "@chakra-ui/provider";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import theme from "../providers/theme";
import AuthProvider from "../auth/AuthProvider";
import queryClient from "../providers/query-client";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
