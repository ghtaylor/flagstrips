import { Flag, FlagPost, StripImageOption } from "@flagstrips/common";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "react-query";
import { deleteFlagByUid, getFlagByUid, getFlags, getStripImageOptions, postFlag } from "../providers/axios";

export const FLAG_QUERY_KEY = "flags";
export const STRIP_IMAGE_OPTION_QUERY_KEY = "strip_image_options";

export const useFlags = (
    options?: Omit<UseQueryOptions<unknown, Error, Flag[], string>, "queryKey" | "queryFn">,
): UseQueryResult<Flag[], Error> => useQuery(FLAG_QUERY_KEY, getFlags, options);

export const useFlag = (
    uid: string,
    options?: Omit<UseQueryOptions<Flag, Error>, "queryKey" | "queryFn">,
): UseQueryResult<Flag, Error> => useQuery([FLAG_QUERY_KEY, uid], () => getFlagByUid(uid), options);

export const useCreateFlag = (): UseMutationResult<Flag, Error, FlagPost | undefined, unknown> => {
    const queryClient = useQueryClient();

    return useMutation((flagPost) => postFlag(flagPost), {
        onSuccess: () => {
            queryClient.invalidateQueries(FLAG_QUERY_KEY);
        },
    });
};

export const useDeleteFlag = (): UseMutationResult<void, Error, string, unknown> => {
    const queryClient = useQueryClient();

    return useMutation((flagUid) => deleteFlagByUid(flagUid), {
        onSuccess: () => {
            queryClient.invalidateQueries(FLAG_QUERY_KEY);
        },
    });
};

export const useStripImageOptions = (): UseQueryResult<StripImageOption[], Error> =>
    useQuery(STRIP_IMAGE_OPTION_QUERY_KEY, getStripImageOptions);
