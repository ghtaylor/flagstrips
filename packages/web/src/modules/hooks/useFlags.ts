import { Flag } from "@flagstrips/common";
import { useQuery, UseQueryResult } from "react-query";
import { getFlagByUid, getFlags } from "../providers/axios";

export const FLAG_QUERY_KEY = "flags";

const useFlags = (): UseQueryResult<Flag[], Error> => useQuery(FLAG_QUERY_KEY, getFlags);

export const useFlag = (flagUid: string): UseQueryResult<Flag, Error> =>
    useQuery([FLAG_QUERY_KEY, flagUid], () => getFlagByUid(flagUid));

export default useFlags;
