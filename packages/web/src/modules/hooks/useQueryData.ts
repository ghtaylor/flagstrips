import { Flag, StripImageOption } from "@flagstrips/common";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { getFlagByUid, getFlags, getStripImageOptions } from "../providers/axios";

export const FLAG_QUERY_KEY = "flags";
export const STRIP_IMAGE_OPTION_QUERY_KEY = "strip_image_options";

export const useFlags = (): UseQueryResult<Flag[], Error> => useQuery(FLAG_QUERY_KEY, getFlags);

export const useFlag = (
    uid: string,
    options?: Omit<UseQueryOptions<Flag, Error>, "queryKey" | "queryFn">,
): UseQueryResult<Flag, Error> => useQuery([FLAG_QUERY_KEY, uid], () => getFlagByUid(uid), options);

export const useStripImageOptions = (): UseQueryResult<StripImageOption[], Error> =>
    useQuery(STRIP_IMAGE_OPTION_QUERY_KEY, getStripImageOptions);
