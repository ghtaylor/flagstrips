import { Box, BoxProps } from "@chakra-ui/layout";
import { ComponentWithAs } from "@chakra-ui/system";
import { Flag } from "@flagstrips/common";
import StripComponent from "./Strip";

interface FlagProps {
    flag: Flag;
    onlyShowStripPosition?: number;
}

const FlagComponent: ComponentWithAs<"div", BoxProps & FlagProps> = ({ flag, onlyShowStripPosition, ...props }) => {
    return (
        <Box {...props}>
            {onlyShowStripPosition !== undefined && flag.strips[onlyShowStripPosition] !== undefined ? (
                <StripComponent
                    strip={flag.strips[onlyShowStripPosition]}
                    paddingTop={flag.padding.top}
                    paddingRight={flag.padding.right}
                    paddingBottom={flag.padding.bottom}
                    paddingLeft={flag.padding.left}
                />
            ) : (
                flag.strips.map((strip) => <StripComponent strip={strip} key={strip.uid} />)
            )}
        </Box>
    );
};

export default FlagComponent;
