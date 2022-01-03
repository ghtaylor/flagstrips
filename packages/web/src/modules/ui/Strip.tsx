/** @jsxImportSource @emotion/react */
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { ComponentWithAs } from "@chakra-ui/system";
import { css } from "@emotion/react";
import { Strip } from "@flagstrips/common";
import { ReactSVG } from "react-svg";
import { useStripImageOption } from "../providers/useQueryData";

interface StripProps {
    strip: Strip;
}

const StripComponent: ComponentWithAs<"div", FlexProps & StripProps> = ({ strip, ...props }) => {
    const { data: imageOption } = useStripImageOption(strip?.image.optionUid);
    return (
        <Flex
            backgroundColor={strip.backgroundColor}
            justifyContent="center"
            alignItems="center"
            flexDirection={strip.image.position === "left" ? "row" : "row-reverse"}
            {...props}
        >
            {imageOption && (
                <ReactSVG
                    src={imageOption.uri}
                    css={css`
                        svg {
                            fill: ${strip.image.color};
                            width: ${strip.image.size}px;
                            height: ${strip.image.size}px;
                        }
                    `}
                />
            )}
            <Text fontSize={strip.text.fontSize} fontWeight={strip.text.fontWeight} color={strip.text.color}>
                {strip.text.value}
            </Text>
        </Flex>
    );
};

export default StripComponent;
