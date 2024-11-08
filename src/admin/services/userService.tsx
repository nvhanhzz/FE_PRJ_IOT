import {del, get, patchJson} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";
import {User} from "../pages/User/Update";

const PREFIX_USER: string = import.meta.env.VITE_PREFIX_USER as string;

export const getUsers = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_USER}`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteUser = async (ids: string[]): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_USER}/${idString}`;
        return await del(url);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_USER}/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserById = async (id: string, option: User): Promise<Response> => {
    try {
        const response = await patchJson(`${PREFIX_USER}/${id}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};