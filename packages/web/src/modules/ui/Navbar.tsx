import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    ThemeTypings,
} from "@chakra-ui/react";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";

type NavbarSize = "sm" | "default";

type BaseNavbarItemProp = {
    text: string;
    url?: string;
    onItemClicked?: () => void;
};

type NavbarItemProp = BaseNavbarItemProp & {
    variant?: ThemeTypings["components"]["Button"]["variants"];
    colorScheme?: ThemeTypings["colorSchemes"];
};

export interface NavbarProps {
    size?: NavbarSize;
    buttonSpacing?: number;
    homeItem: BaseNavbarItemProp;
    items?: NavbarItemProp[];
    endDropdownItem?: NavbarItemProp & {
        items: BaseNavbarItemProp[];
    };
}

const getViewPropsFromSize = (
    size: NavbarSize,
): {
    containerPaddingY: number;
    headingSize: "md" | "lg";
    buttonSize: "sm" | "md";
} => {
    switch (size) {
        case "sm":
            return {
                containerPaddingY: 3,
                headingSize: "md",
                buttonSize: "sm",
            };
        default:
            return {
                containerPaddingY: 6,
                headingSize: "lg",
                buttonSize: "md",
            };
    }
};

const Navbar: React.FC<NavbarProps> = ({
    size = "default",
    buttonSpacing,
    homeItem,
    items = [
        {
            text: "login",
            url: "/login",
        },
        {
            text: "register",
            url: "/register",
            variant: "outline",
        },
    ],
    endDropdownItem,
}) => {
    const { containerPaddingY, headingSize, buttonSize } = getViewPropsFromSize(size);

    return (
        <Box width="100%" background="white">
            <Flex
                as={Container}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                height="auto"
                width="100%"
                paddingY={containerPaddingY}
            >
                <Heading
                    size={headingSize}
                    color="green.500"
                    as={homeItem.url ? "a" : undefined}
                    href={homeItem.url}
                    onClick={homeItem.onItemClicked}
                >
                    {homeItem.text}
                </Heading>
                <HStack spacing={buttonSpacing}>
                    {items.map(({ text, url, onItemClicked, variant, colorScheme }) => (
                        <Button
                            key={text}
                            as={url ? "a" : undefined}
                            href={url}
                            variant={variant}
                            colorScheme={colorScheme}
                            size={buttonSize}
                            borderWidth={variant === "outline" ? 2 : undefined}
                            onClick={onItemClicked}
                        >
                            {text}
                        </Button>
                    ))}
                    {endDropdownItem && (
                        <Menu placement="bottom-end">
                            <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                href={endDropdownItem.url}
                                variant={endDropdownItem.variant}
                                colorScheme={endDropdownItem.colorScheme}
                                borderWidth={endDropdownItem.variant === "outline" ? 2 : undefined}
                                size={buttonSize}
                            >
                                {endDropdownItem.text}
                            </MenuButton>
                            <MenuList>
                                {endDropdownItem.items.map(({ text, url, onItemClicked }) => (
                                    <MenuItem key={text} icon={<ArrowBackIcon />} href={url} onClick={onItemClicked}>
                                        {text}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;
