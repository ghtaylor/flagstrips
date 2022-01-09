import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { StripOverview, StripButton, Container } from "./components";
import { editorHeader, editorCaption, editorAction } from "./textStyles";
import { AppBlueVariant } from "./variants";

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "green" }), {
    components: {
        StripOverview,
        StripButton,
        Container,
        Button: {
            variants: {
                "app-blue": AppBlueVariant,
            },
        },
    },
    textStyles: {
        editorHeader,
        editorCaption,
        editorAction,
    },
    styles: {
        global: {
            button: {
                transition: "all 100ms ease-in-out",
            },
        },
    },
});

export default theme;
