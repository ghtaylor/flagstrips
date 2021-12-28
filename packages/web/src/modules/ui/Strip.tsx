import { Image } from "@chakra-ui/image";
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { ComponentWithAs } from "@chakra-ui/system";
import { Strip } from "@flagstrips/common";

interface StripProps {
    strip: Strip;
}

const StripComponent: ComponentWithAs<"div", FlexProps & StripProps> = ({ strip, ...props }) => {
    return (
        <Flex backgroundColor={strip.backgroundColor} justifyContent="center" alignItems="center" {...props}>
            <Image src={strip.image.imageOption.uri} width={12} height={12} />
            <Text fontSize={strip.text.fontSize} fontWeight={strip.text.fontWeight} color={strip.text.color}>
                {strip.text.value}
            </Text>
        </Flex>
    );
};

export default StripComponent;
