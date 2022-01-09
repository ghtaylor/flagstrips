import { ComponentWithAs, Icon, IconProps } from "@chakra-ui/react";
import axios from "axios";
import { NodeWithChildren } from "domhandler";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import { useCallback, useEffect, useState } from "react";

interface SVGProps {
    src: string;
}

const SVGIcon: ComponentWithAs<"svg", IconProps & SVGProps> = ({ src, ...props }) => {
    const [svg, setSvg] = useState<string>();

    const retrieveSvg = useCallback(() => {
        axios.get(src).then((response) => setSvg(response.data));
    }, [src]);

    useEffect(() => {
        retrieveSvg();
    }, [src]);

    return svg ? (
        <>
            {parse(svg, {
                replace: (domNode) => {
                    if (domNode instanceof NodeWithChildren && domNode.name === "svg" && domNode.attribs) {
                        const svgProps = attributesToProps(domNode.attribs);
                        return (
                            <Icon {...svgProps} {...props}>
                                {domToReact(domNode.children)}
                            </Icon>
                        );
                    }
                    return;
                },
            })}
        </>
    ) : (
        <></>
    );
};

export default SVGIcon;
