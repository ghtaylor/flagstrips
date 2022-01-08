/** @jsxImportSource @emotion/react */
import { ComponentWithAs, FlexProps, Grid, GridItem, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { Strip } from "@flagstrips/common";
import { ReactSVG } from "react-svg";
import { useStripImageOption } from "../providers/useQueryData";

interface StripProps {
    strip: Strip;
}

const StripComponent: ComponentWithAs<"div", FlexProps & StripProps> = ({ strip, ...props }) => {
    const { data: imageOption } = useStripImageOption(strip.image.optionUid);

    return (
        <Grid
            templateColumns="auto auto"
            gridColumnGap={`${strip.image.gapToText}px`}
            backgroundColor={strip.backgroundColor}
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {imageOption && (
                <GridItem order={strip.image.position === "left" ? 1 : 2}>
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
                </GridItem>
            )}
            <GridItem order={strip.image.position === "left" ? 2 : 1}>
                <Text fontSize={strip.text.fontSize} fontWeight={strip.text.fontWeight} color={strip.text.color}>
                    {strip.text.value}
                </Text>
            </GridItem>
        </Grid>
    );
};

export default StripComponent;
