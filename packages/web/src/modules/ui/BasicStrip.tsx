import { ComponentWithAs, Flex, FlexProps, Image, Text } from "@chakra-ui/react";
import { Strip } from "@flagstrips/common";

interface BasicStripProps {
    strip: Strip;
}

const BasicStrip: ComponentWithAs<"div", FlexProps & BasicStripProps> = ({ strip, ...props }) => {
    return (
        <Flex
            alignItems="center"
            paddingX={2}
            paddingY={1}
            borderWidth={1}
            borderColor="gray.200"
            borderRadius={4}
            {...props}
        >
            <Image height={6} width={6} marginEnd={2} src={strip.image.imageOption.uri} />
            <Text size="xs" fontWeight="medium" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {strip.text.value}
            </Text>
        </Flex>
    );
};

export default BasicStrip;
