import { del, get, patchJson, postJson } from "../utils/request";
import { getWithParams } from "../utils/getWithParams.tsx";
import { Device } from "../pages/Device/Create";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_DEVICE = import.meta.env.VITE_PREFIX_DEVICE as string;

export const getDevices = (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_DEVICE}`;
    const params = { page, pageSize, [searchKey || '']: searchValue };
    return handleRequest(getWithParams(url, params));
};

export const deleteDevice = (ids: string[]): Promise<Response> => {
    const url = `${PREFIX_DEVICE}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const postDevice = (option: Device): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_DEVICE}`, option));
};

export const getDeviceById = (id: string): Promise<Response> => {
    return handleRequest(get(`${PREFIX_DEVICE}/${id}`));
};

export const updateDeviceById = (id: string, option: Device): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_DEVICE}/${id}`, option));
};