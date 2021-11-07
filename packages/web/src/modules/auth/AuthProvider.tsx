import { User, UserLogin } from "@flagstrips/common";
import { produce } from "immer";
import React, { useEffect, useState } from "react";
import create, { StoreApi, UseBoundStore } from "zustand";
import createContext from "zustand/context";
import { getAccessTokenByLogin, getUser, logout } from "../providers/axios";

interface AuthStateValues {
    user?: User;
    isAuthenticated: boolean;
}

interface AuthState extends AuthStateValues {
    login: (userLogin: UserLogin) => Promise<void>;
    logout: () => Promise<void>;
}

const getInitialStateValues = async (): Promise<AuthStateValues> => {
    try {
        const user = await getUser();
        return { user, isAuthenticated: true };
    } catch (error) {
        return { isAuthenticated: false };
    }
};

const createStore = (initialStateValues: AuthStateValues): UseBoundStore<AuthState, StoreApi<AuthState>> =>
    create((set) => ({
        ...initialStateValues,
        login: async (userLogin: UserLogin) => {
            await getAccessTokenByLogin(userLogin);
            const user = await getUser();
            return set((state) =>
                produce(state, (draftState) => {
                    draftState.user = user;
                    draftState.isAuthenticated = true;
                }),
            );
        },
        logout: async () => {
            await logout();
            return set((state) =>
                produce(state, (draftState) => {
                    draftState.user = undefined;
                    draftState.isAuthenticated = false;
                }),
            );
        },
    }));

const { Provider, useStore } = createContext<AuthState>();

const AuthProvider: React.FC = ({ children }) => {
    const [isFetching, setIsFetching] = useState(true);
    const [initialStateValues, setInitialStateValues] = useState<AuthStateValues>({ isAuthenticated: false });

    useEffect(() => {
        (async () => {
            const initialStateValues = await getInitialStateValues();
            setInitialStateValues(initialStateValues);
            setIsFetching(false);
        })();
    }, []);

    return isFetching ? <></> : <Provider createStore={() => createStore(initialStateValues)}>{children}</Provider>;
};

export const useAuth = useStore;

export default AuthProvider;
