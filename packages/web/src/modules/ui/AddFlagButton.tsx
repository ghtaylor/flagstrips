import { Box, ButtonProps, CircularProgress, ComponentWithAs, Heading, Icon } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";

const AddFlagButton: ComponentWithAs<"button", ButtonProps> = ({ isLoading, ...props }) => {
    return (
        <Box
            as="button"
            role="group"
            minHeight={248}
            background="white"
            borderColor="gray.200"
            borderWidth={1}
            borderRadius="md"
            borderStyle="dashed"
            transition="background 100ms ease-in-out"
            _hover={{
                background: "gray.50",
            }}
            {...props}
        >
            {isLoading ? (
                <CircularProgress isIndeterminate color="gray.200" marginBottom={2} />
            ) : (
                <Icon
                    as={HiPlus}
                    boxSize="3em"
                    color="gray.200"
                    transition="color 100ms ease-in-out"
                    _groupHover={{ color: "gray.800" }}
                />
            )}
            <Heading
                size="md"
                color="gray.200"
                transition="color 100ms ease-in-out"
                _groupHover={{ color: "gray.800" }}
            >
                add flag
            </Heading>
        </Box>
    );
};

export default AddFlagButton;
