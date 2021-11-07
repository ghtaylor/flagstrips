import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "green" }), {
    components: {
        Container: {
            baseStyle: {
                maxWidth: "container.lg",
            },
        },
    },
});

// {
//     components: {
//         Button: {
//             variants: {
//                 outline: {
//                     borderWidth: 2
//                 },
//             },
//         },
//     },
// }

export default theme;
