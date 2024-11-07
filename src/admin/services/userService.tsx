import {del} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";

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