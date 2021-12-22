import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "green" }), {
    components: {
        StripOverview: {
            baseStyle: {
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                color: "black",
                borderWidth: 1,
                borderColor: "gray.200",
                borderRadius: 4,
            },
            sizes: {
                sm: {
                    paddingX: 2,
                    paddingY: 1,
                },
                md: {
                    paddingX: 3,
                    paddingY: 2,
                },
                lg: {
                    paddingX: 3,
                    paddingY: 2,
                },
                xl: {
                    paddingX: 3,
                    paddingY: 2,
                },
            },
            defaultProps: {
                size: "sm",
            },
        },
        StripButton: {
            baseStyle: {
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                color: "black",
                borderWidth: 1,
                borderColor: "gray.200",
                borderRadius: 4,
                _hover: {
                    backgroundColor: "blue.50",
                    borderColor: "blue.100",
                },
                _active: {
                    backgroundColor: "blue.100",
                    borderColor: "blue.200",
                },
            },
            sizes: {
                sm: {
                    paddingX: 2,
                    paddingY: 1,
                },
                md: {
                    paddingX: 3,
                    paddingY: 2,
                },
                lg: {
                    paddingX: 3,
                    paddingY: 2,
                },
                xl: {
                    paddingX: 3,
                    paddingY: 2,
                },
            },
            variants: {
                selected: {
                    borderColor: "blue.300",
                    backgroundColor: "blue.100",
                },
            },
            defaultProps: {
                size: "sm",
            },
        },
        Container: {
            baseStyle: {
                maxWidth: "container.lg",
            },
        },
    },
    textStyles: {
        editorHeader: {
            fontWeight: "extrabold",
        },
        editorCaption: {
            fontSize: 12,
            fontWeight: "bold",
            color: "gray.500",
            letterSpacing: "2%",
        },
    },
    styles: {
        global: {
            button: {
                transition: "all 100ms ease-in-out",
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
