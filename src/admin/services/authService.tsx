import { get, postJson } from "../utils/request";

const PREFIX_ACCOUNT: string = import.meta.env.VITE_PREFIX_ACCOUNT as string;

export const getCurrentAccount = async (): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_ACCOUNT}/check-account`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogin = async (option: Record<string, any>): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_ACCOUNT}/login`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogout = async (): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_ACCOUNT}/logout`, {});
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};