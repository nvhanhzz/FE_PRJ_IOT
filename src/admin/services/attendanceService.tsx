import { getWithParams } from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_ATTENDANCE = import.meta.env.VITE_PREFIX_ATTENDANCE as string;

export const getAttendanceRecords = (
    page?: string | undefined | number,
    pageSize?: string | undefined | number,
    startDate?: string | undefined | number,
    endDate?: string | undefined | number,
    shift?: string | undefined | number,
    username?: string | undefined | number,
    nameDevice?: string | undefined | number
): Promise<Response> => {
    const url = `${PREFIX_ATTENDANCE}/filter`;

    // Chỉ bao gồm các tham số nào có giá trị
    const params = Object.fromEntries(
        Object.entries({ page, pageSize, startDate, endDate, shift, username, nameDevice }).filter(
            ([, value]) => value !== undefined
        )
    );

    return handleRequest(getWithParams(url, params));
};