import { Button, ButtonProps, IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Text } from "@chakra-ui/layout";
import {
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
} from "@chakra-ui/popover";
import { ComponentWithAs, ThemingProps, useStyleConfig } from "@chakra-ui/system";
import { Strip } from "@flagstrips/common";
import { useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";

interface StripOverviewProps {
    strip?: Strip;
    showDelete?: boolean;
    onDeleteClick?: () => void;
}

const StripButton: ComponentWithAs<"button", ButtonProps & ThemingProps & StripOverviewProps> = ({
    strip,
    showDelete = true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteClick = () => {},
    variant,
    size,
    children,
    ...props
}) => {
    const styles = useStyleConfig("StripButton", { variant: variant, size });

    useEffect(() => {
        if ((!strip && !children) || (strip && children))
            throw new Error("Must provide one of strip or children props, not both or none.");
    }, [children, strip]);

    return (
        <Box position="relative" role="group">
            <Button justifyContent="start" sx={styles} {...props}>
                {strip && (
                    <>
                        <Image height={6} width={6} marginEnd={2} src={strip.image.imageOption.uri} />
                        <Text
                            size="xs"
                            fontWeight="medium"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                        >
                            {strip.text.value}
                        </Text>
                    </>
                )}
                {children}
            </Button>
            {showDelete && (
                <Popover isLazy placement="bottom-start">
                    <PopoverTrigger>
                        <IconButton
                            aria-label="delete"
                            icon={<FiTrash2 />}
                            variant="ghost"
                            colorScheme="red"
                            size="xs"
                            position="absolute"
                            top={0}
                            right={0}
                            transform="translateY(50%)"
                            marginTop={-Math.abs(props.marginBottom / 2)}
                            marginEnd={2}
                            transition="opacity 200ms ease-in-out"
                            opacity={0}
                            _groupFocus={{ opacity: 1 }}
                            _groupHover={{ opacity: 1 }}
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight="bold">Delete strip</PopoverHeader>
                        <PopoverBody>Are you sure you want to delete this strip?</PopoverBody>
                        <PopoverFooter marginStart="auto">
                            <Button colorScheme="red" size="sm" onClick={() => onDeleteClick()}>
                                Delete
                            </Button>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            )}
        </Box>
    );
};

export default StripButton;
