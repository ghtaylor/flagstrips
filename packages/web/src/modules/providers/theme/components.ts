import { AppBlueVariant } from "./variants";

export const StripOverview = {
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
};

export const StripButton = {
    baseStyle: {
        alignItems: "center",
        width: "100%",
        ...AppBlueVariant,
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
};

export const Container = {
    baseStyle: {
        maxWidth: "container.lg",
    },
};
