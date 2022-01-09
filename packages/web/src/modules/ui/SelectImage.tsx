import {
    ButtonProps,
    ComponentWithAs,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SimpleGrid,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import SVGIcon from "./SVGIcon";

interface SelectImageOption {
    id: string;
    value: string;
    imageUrl: string;
    "aria-label": string;
}

interface SelectImageProps {
    options: SelectImageOption[];
    //SelectImageOption object or ID.
    selectedOption: SelectImageOption | string;
    onOptionSelect: (option: SelectImageOption) => void;
}

const SelectImage: ComponentWithAs<"button", ButtonProps & SelectImageProps> = ({
    options,
    selectedOption,
    onOptionSelect,
    ...props
}) => {
    const selectedOptionButtonRef = useRef(null);

    const memoSelectedOption = useMemo(() => {
        if (typeof selectedOption === "string") {
            const option = options.find((option) => option.id === selectedOption);
            if (!option) throw new Error("selectedOption value must be present within options array, based on id.");
            return option;
        }
        return selectedOption;
    }, [selectedOption]);

    return (
        <Popover initialFocusRef={selectedOptionButtonRef} placement="bottom-end">
            <PopoverTrigger>
                <Select as="button" textAlign="start" {...props}>
                    {memoSelectedOption.value}
                </Select>
            </PopoverTrigger>
            <PopoverContent width="auto">
                <SimpleGrid as="ul" columns={5} gridGap={2} margin={2}>
                    {options.map((option) => (
                        <IconButton
                            ref={option.id === memoSelectedOption.id ? selectedOptionButtonRef : undefined}
                            key={option.id}
                            aria-label={option["aria-label"]}
                            role="option"
                            cursor="pointer"
                            height={10}
                            width={10}
                            variant="app-blue"
                            isActive={option.id === memoSelectedOption.id}
                            icon={<SVGIcon src={option.imageUrl} boxSize={4} />}
                            size="xs"
                            onClick={() => onOptionSelect(option)}
                        />
                    ))}
                </SimpleGrid>
            </PopoverContent>
        </Popover>
    );
};

export default SelectImage;
