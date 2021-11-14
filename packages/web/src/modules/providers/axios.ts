import { ApiResponseCollection, AuthAccessTokenResponse, Flag, User, UserLogin } from "@flagstrips/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

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
    return data.results;
};

export const getFlagByUid = async (uid: string): Promise<Flag> => {
    const { data }: AxiosResponse<Flag> = await apiAxios.get(`/me/flags/${uid}`);
    return data;
};
