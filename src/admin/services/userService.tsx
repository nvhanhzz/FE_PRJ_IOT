import { del, get, patchJson } from "../utils/request";
import { getWithParams } from "../utils/getWithParams.tsx";
import { User } from "../pages/User/Update";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_USER = import.meta.env.VITE_PREFIX_USER as string;

export const getUsers = (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_USER}`;
    const params = Object.fromEntries(
        Object.entries({ page, pageSize, searchKey, searchValue }).filter(
            ([, value]) => value !== undefined
        )
    );
    return handleRequest(getWithParams(url, params));
};

export const deleteUser = (ids: string[]): Promise<Response> => {
    const url = `${PREFIX_USER}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getUserById = (id: string): Promise<Response> => {
    const url = `${PREFIX_USER}/${id}`;
    return handleRequest(get(url));
};

export const updateUserById = (id: string, option: User): Promise<Response> => {
    const url = `${PREFIX_USER}/${id}`;
    return handleRequest(patchJson(url, option));
};