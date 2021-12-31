import {
    Button,
    ButtonProps,
    Checkbox,
    CheckboxGroup,
    ComponentWithAs,
    Flex,
    Heading,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export interface ApplyStylesToAllCheckbox<T = string | number> {
    text: string;
    value: T;
}

interface ApplyStylesToAllButtonProps {
    checkboxes: ApplyStylesToAllCheckbox[];
    onApply: (selectedValues: (string | number)[]) => void;
}

const ApplyStylesToAllButton: ComponentWithAs<"button", ButtonProps & ApplyStylesToAllButtonProps> = ({
    checkboxes,
    onApply,
    ...props
}) => {
    const firstCheckboxRef = useRef(null);
    const { onOpen, onClose, isOpen } = useDisclosure();

    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

    useEffect(() => {
        if (checkboxes.length < 1) throw new Error("'checkboxes' prop must have length of at least 1.");
    }, []);

    return (
        <Popover
            initialFocusRef={firstCheckboxRef}
            isLazy
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom-start"
        >
            <PopoverTrigger>
                <Button size="xs" variant="link" colorScheme="blue" {...props}>
                    apply styles to all strips
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverCloseButton />
                <PopoverHeader>
                    <Heading size="xs">apply styles</Heading>
                </PopoverHeader>
                <PopoverBody>
                    <Flex flexDirection="column">
                        <CheckboxGroup onChange={(values) => setSelectedValues(values)}>
                            {checkboxes.map(({ text, value }, index) => (
                                <Checkbox
                                    ref={index === 0 ? firstCheckboxRef : undefined}
                                    value={value}
                                    key={value}
                                    size="sm"
                                >
                                    {text}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </Flex>
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                    <Button
                        size="sm"
                        onClick={() => {
                            onApply(selectedValues);
                            onClose();
                        }}
                    >
                        apply
                    </Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

export default ApplyStylesToAllButton;
