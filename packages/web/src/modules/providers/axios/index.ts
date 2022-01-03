import {
    ApiResponseCollection,
    AuthAccessTokenResponse,
    Flag,
    FlagPost,
    Strip,
    StripImageOption,
    StripPost,
    User,
    UserLogin,
} from "@flagstrips/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { handleDates } from "./util";

const defaultAxiosConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:5000/api/",
    withCredentials: true,
};

const authAxios = axios.create(defaultAxiosConfig);
const apiAxios = axios.create(defaultAxiosConfig);

let accessToken = "";

apiAxios.interceptors.request.use(async (config) => {
    config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    };

    return config;
});

apiAxios.interceptors.response.use((originalResponse) => {
    handleDates(originalResponse.data);
    return originalResponse;
});

createAuthRefreshInterceptor(apiAxios, async (failedRequest) => {
    accessToken = await getAccessTokenByRefresh();
    failedRequest.response.config.headers["Authorization"] = `Bearer ${accessToken}`;
});

export const getAccessTokenByRefresh = async (): Promise<string> => {
    const { data }: AxiosResponse<AuthAccessTokenResponse> = await authAxios.get("/auth/refresh-token");
    return data.accessToken;
};

export const getAccessTokenByLogin = async (userLogin: UserLogin): Promise<string> => {
    const { data }: AxiosResponse<AuthAccessTokenResponse> = await authAxios.post("/auth/login", userLogin);
    return data.accessToken;
};

export const logout = async (): Promise<void> => authAxios.get("/auth/logout");

export const getUser = async (): Promise<User> => {
    const { data }: AxiosResponse<User> = await apiAxios.get("/me");
    return data;
};

export const getFlags = async (): Promise<Flag[]> => {
    const { data }: AxiosResponse<ApiResponseCollection<Flag>> = await apiAxios.get("/me/flags");
    data.results.sort((a, b) => a.created.getTime() - b.created.getTime());
    return data.results;
};

export const getFlagByUid = async (uid: string): Promise<Flag> => {
    const { data }: AxiosResponse<Flag> = await apiAxios.get(`/me/flags/${uid}`);
    return data;
};

export const patchFlagByUid = async (uid: string, flagPatch: FlagPost): Promise<Flag> => {
    const { data }: AxiosResponse<Flag> = await apiAxios.patch(`/me/flags/${uid}`, flagPatch);
    return data;
};

export const deleteFlagByUid = async (uid: string): Promise<void> => apiAxios.delete(`/me/flags/${uid}`);

export const postFlag = async (flagPost?: FlagPost): Promise<Flag> => {
    const { data }: AxiosResponse<Flag> = await apiAxios.post(`/me/flags`, flagPost);
    return data;
};

export const getStripByUid = async (uid: string): Promise<Strip> => {
    const { data }: AxiosResponse<Strip> = await apiAxios.get(`/me/strips/${uid}`);
    return data;
};

export const patchStripByUid = async (uid: string, stripPatch: StripPost): Promise<Strip> => {
    const { data }: AxiosResponse<Strip> = await apiAxios.patch(`/me/strips/${uid}`, stripPatch);
    return data;
};

export const postStrip = async (flagUid: string, stripPost?: StripPost): Promise<Strip> => {
    const { data }: AxiosResponse<Strip> = await apiAxios.post(`/me/flags/${flagUid}/strips`, stripPost);
    return data;
};

export const deleteStripByUid = async (uid: string): Promise<void> => apiAxios.delete(`/me/strips/${uid}`);

export const getStripImageOptions = async (): Promise<StripImageOption[]> => {
    const { data }: AxiosResponse<ApiResponseCollection<StripImageOption>> = await apiAxios.get(
        "/me/strips/image-options",
    );
    return data.results;
};

export const getStripImageOptionByUid = async (uid: string): Promise<StripImageOption> => {
    const { data }: AxiosResponse<StripImageOption> = await apiAxios.get(`/me/strips/image-options/${uid}`);
    return data;
};
