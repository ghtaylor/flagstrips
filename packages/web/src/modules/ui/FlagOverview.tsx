import { Box, Button, ComponentWithAs, Flex, FlexProps, Text } from "@chakra-ui/react";
import { Flag } from "@flagstrips/common";
import BasicStrip from "./BasicStrip";

interface FlagOverviewProps {
    flag: Flag;
    editHref?: (flag: Flag) => string;
    previewHref?: (flag: Flag) => string;
}

const FlagOverview: ComponentWithAs<"article", FlexProps & FlagOverviewProps> = ({
    flag,
    editHref,
    previewHref,
    ...props
}) => (
    <Flex as="article" flexDirection="column" borderColor="gray.200" borderWidth={1} borderRadius={4} {...props}>
        <Box padding={2}>
            {flag.strips.map((strip, index) => (
                <BasicStrip key={strip.uid} strip={strip} marginBottom={index === flag.strips.length - 1 ? 0 : 1} />
            ))}
        </Box>
        <Flex flexDirection="column" padding={2} marginTop="auto" borderColor="gray.200" borderTopWidth={1}>
            <Text size="sm" fontWeight="semibold" paddingBottom={6}>
                {flag.title}
            </Text>
            <Flex>
                <Button size="xs" marginEnd={1} as="a" href={editHref ? editHref(flag) : undefined}>
                    edit
                </Button>
                <Button
                    size="xs"
                    colorScheme="gray"
                    variant="outline"
                    as="a"
                    href={previewHref ? previewHref(flag) : undefined}
                >
                    preview
                </Button>
                <Button size="xs" colorScheme="gray" variant="outline" marginStart="auto">
                    ...
                </Button>
            </Flex>
        </Flex>
    </Flex>
);

export default FlagOverview;
