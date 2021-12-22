import {
    Box,
    ComponentWithAs,
    Input,
    InputGroup,
    InputLeftElement,
    InputProps,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import Color from "color";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebouncedCallback } from "use-debounce";

const applyHashtagToHex = (hex: string): string => (hex.startsWith("#") ? hex : `#${hex}`);
const removeHashtagFromHex = (hex: string): string => (hex.startsWith("#") ? hex.slice(1, hex.length) : hex);

interface ColorInputProps {
    onHexChange: (hex: string) => void;
}

const ColorInput: ComponentWithAs<"input", InputProps & ColorInputProps> = ({
    value,
    variant,
    size,
    onHexChange,
    ...props
}) => {
    if (typeof value !== "string") throw new Error("<ColorInput /> value must be a string.");
    const [controlledValue, setControlledValue] = useState(removeHashtagFromHex(value));
    const [hex, setHex] = useState(value);

    useEffect(() => {
        handleAttemptHexUpdate(value);
    }, [value]);

    useEffect(() => {
        onHexChange(hex);
        setControlledValue(removeHashtagFromHex(hex));
    }, [hex]);

    const handleAttemptHexUpdate = useCallback(
        (value: string) => {
            try {
                value = applyHashtagToHex(value);
                const color = new Color(value);
                setHex(color.hex());
            } catch (error) {
                setControlledValue(removeHashtagFromHex(hex));
            }
        },
        [hex, controlledValue],
    );

    const handleChange = (value: string) => {
        setControlledValue(removeHashtagFromHex(value));
    };

    const debouncedHandleAttemptHexUpdate = useDebouncedCallback(handleAttemptHexUpdate, 100);

    return (
        <InputGroup variant={variant} size={size}>
            <InputLeftElement padding={1}>
                <Popover placement="start">
                    <PopoverTrigger>
                        <Box height="100%" width="100%" cursor="pointer" backgroundColor={hex} borderRadius="sm" />
                    </PopoverTrigger>
                    <PopoverContent width="auto">
                        <HexColorPicker
                            color={hex}
                            onChange={(newHex) => {
                                debouncedHandleAttemptHexUpdate(newHex);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </InputLeftElement>
            <Input
                value={controlledValue.toUpperCase()}
                {...props}
                onChange={({ target }) => handleChange(target.value)}
                onBlur={({ target }) => handleAttemptHexUpdate(target.value)}
            />
        </InputGroup>
    );
};
export default ColorInput;
