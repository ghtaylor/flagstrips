import { Image } from "@chakra-ui/image";
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { ComponentWithAs, useStyleConfig } from "@chakra-ui/system";
import { Strip } from "@flagstrips/common";
import { useStripImageOption } from "../providers/useQueryData";

interface StripOverviewProps {
    strip?: Strip;
}

const StripOverview: ComponentWithAs<"div", FlexProps & StripOverviewProps> = ({
    strip,
    variant,
    size,
    children,
    ...props
}) => {
    const styles = useStyleConfig("StripOverview", { variant: variant, size });

    const { data: imageOption } = useStripImageOption(strip?.image.optionUid);

    return (
        <Flex sx={styles} {...props}>
            {strip && (
                <>
                    {imageOption && <Image height={6} width={6} marginEnd={2} src={imageOption.uri} />}
                    <Text size="xs" fontWeight="medium" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        {strip.text.value}
                    </Text>
                </>
            )}
            {children}
        </Flex>
    );
};

export default StripOverview;
