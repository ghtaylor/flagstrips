import { SimpleGridProps, SimpleGrid, GridItem } from "@chakra-ui/layout";
import { ComponentWithAs } from "@chakra-ui/system";
import { Flag } from "@flagstrips/common";
import StripComponent from "./Strip";

interface FlagProps {
    flag: Flag;
    onlyShowStripPosition?: number;
}

const FlagComponent: ComponentWithAs<"div", SimpleGridProps & FlagProps> = ({
    flag,
    onlyShowStripPosition,
    ...props
}) => {
    return (
        <SimpleGrid {...props}>
            {flag.strips.map((strip, index) => (
                <StripComponent
                    as={GridItem}
                    key={strip.uid}
                    strip={strip}
                    paddingTop={`${flag.padding.top}px`}
                    paddingRight={`${flag.padding.right}px`}
                    paddingBottom={`${flag.padding.bottom}px`}
                    paddingLeft={`${flag.padding.left}px`}
                    visibility={
                        onlyShowStripPosition !== undefined
                            ? onlyShowStripPosition === index
                                ? "visible"
                                : "hidden"
                            : "visible"
                    }
                    gridColumn={1}
                    gridRow={1}
                />
            ))}
        </SimpleGrid>
    );
};

export default FlagComponent;
