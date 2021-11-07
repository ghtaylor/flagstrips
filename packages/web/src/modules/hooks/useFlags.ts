import { useQuery, UseQueryResult } from "react-query";
import { Flag } from "@flagstrips/common";
import { getFlags } from "../providers/axios";

export const FLAG_QUERY_KEY = "flags";

const useFlags = (): UseQueryResult<Flag[], Error> => useQuery(FLAG_QUERY_KEY, getFlags);

export default useFlags;
