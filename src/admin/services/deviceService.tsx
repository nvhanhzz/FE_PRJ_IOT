import {del, postJson} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";
import {Device} from "../pages/Device/Create";

const PREFIX_DEVICE: string = import.meta.env.VITE_PREFIX_DEVICE as string;

export const getDevices = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_DEVICE}`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteDevice = async (ids: string[]): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_DEVICE}/${idString}`;
        return await del(url);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postDevice = async (option: Device): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_DEVICE}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}