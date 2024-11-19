import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Pagination, Select, Spin, Table, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import { getAttendanceRecords } from '../../services/attendanceService';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Moment } from 'moment';
import { getDevices } from "../../services/deviceService.tsx";
import * as XLSX from 'xlsx';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface AttendanceRecord {
    rfidCode: string;
    studentCode: string;
    fullName: string;
    attendanceTimeIn: string;
    onTime: boolean;
    shift: string;
    date: string;
    nameDevice: string;
    attendanceTimeOut: string;
}

interface AttendanceFilter {
    startDate?: Moment;
    endDate?: Moment;
    shift?: string;
    studentCode?: string;
    nameDevice?: string;
}

const AttendancePage: React.FC = () => {
    const [data, setData] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [deviceOptions, setDeviceOptions] = useState<{ label: string, value: string }[]>([]);
    const location = useLocation();
    const { t } = useTranslation();

    const [filters, setFilters] = useState<AttendanceFilter>({
        startDate: undefined,
        endDate: undefined,
        shift: '',
        studentCode: '',
        nameDevice: '',
    });

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const { startDate, endDate, shift, studentCode, nameDevice } = filters;

            const filteredParams = {
                page,
                pageSize,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
                endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
                shift: shift || undefined,
                studentCode: studentCode || undefined,
                nameDevice: nameDevice || undefined,
            };

            const params = Object.fromEntries(Object.entries(filteredParams).filter(([, value]) => value !== undefined));

            const response = await getAttendanceRecords(
                params.page,
                params.pageSize,
                params.startDate,
                params.endDate,
                params.shift,
                params.studentCode,
                params.nameDevice
            );

            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            console.log(result);
            setData(result.data.content);
            setTotalItems(result.data.totalElements);
        } catch (error) {
            console.error(error);
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDeviceOptions = async () => {
        try {
            const response = await getDevices();
            if (response.ok) {
                const result = await response.json();
                setDeviceOptions(result.data.content.map((device: { name: string }) => ({ label: device.name, value: device.name })));
            }
        } catch (error) {
            console.error(error);
            message.error(t('admin.message.fetchError'));
        }
    };

    useEffect(() => {
        fetchDeviceOptions();
    }, []);

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [location.search]);

    const handleFilterChange = (changedValues: Partial<AttendanceFilter>) => {
        setFilters((prev) => ({
            ...prev,
            ...changedValues,
        }));
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        fetchData(page, pageSize || 10);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'attendance.xlsx');
    };

    const columns = [
        {
            title: t('admin.attendance.rfidCode'),
            dataIndex: 'rfidCode',
            key: 'rfidCode',
        },
        {
            title: t('admin.attendance.studentCode'),
            dataIndex: 'studentCode',
            key: 'studentCode',
        },
        {
            title: t('admin.attendance.fullName'),
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: t('admin.attendance.attendanceTimeIn'),
            dataIndex: 'attendanceTimeIn',
            key: 'attendanceTimeIn',
        },
        {
            title: t('admin.attendance.onTime'),
            dataIndex: 'onTime',
            key: 'onTime',
            render: (onTime: boolean) => (
                <Tag color={onTime ? 'green' : 'red'}>
                    {onTime ? t('admin.attendance.onTimeYes') : t('admin.attendance.onTimeNo')}
                </Tag>
            ),
        },
        {
            title: t('admin.attendance.shift'),
            dataIndex: 'shift',
            key: 'shift',
        },
        {
            title: t('admin.attendance.date'),
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: t('admin.attendance.nameDevice'),
            dataIndex: 'nameDevice',
            key: 'nameDevice',
        },
    ];

    const shiftOptions = [
        { label: t('admin.attendance.shiftMorning'), value: 'Morning' },
        { label: t('admin.attendance.shiftAfternoon'), value: 'Afternoon' },
        { label: t('admin.attendance.shiftOverTime'), value: 'OverTime' },
    ];

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/attendances`, name: t('admin.attendance.title') },
            ]}
        >
            <Form
                layout="inline"
                style={{ marginBottom: 20 }}
                initialValues={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    shift: filters.shift,
                    studentCode: filters.studentCode,
                    nameDevice: filters.nameDevice,
                }}
                onValuesChange={(changedValues) => handleFilterChange(changedValues)}
            >
                <Form.Item label={t('admin.attendance.startDate')} name="startDate">
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={filters.startDate}
                        onChange={(date) => handleFilterChange({ startDate: date || undefined })}
                    />
                </Form.Item>
                <Form.Item label={t('admin.attendance.endDate')} name="endDate">
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={filters.endDate}
                        onChange={(date) => handleFilterChange({ endDate: date || undefined })}
                    />
                </Form.Item>
                <Form.Item label={t('admin.attendance.shift')} name="shift">
                    <Select
                        placeholder={t('admin.attendance.selectShift')}
                        options={shiftOptions}
                        onChange={(value) => handleFilterChange({ shift: value })}
                        style={{ width: '120px' }}
                    />
                </Form.Item>
                <Form.Item label={t('admin.attendance.studentCode')} name="studentCode">
                    <Input style={{ width: '120px' }} />
                </Form.Item>
                <Form.Item label={t('admin.attendance.nameDevice')} name="nameDevice">
                    <Select
                        placeholder={t('admin.attendance.selectDevice')}
                        options={deviceOptions}
                        onChange={(value) => handleFilterChange({ nameDevice: value })}
                        style={{ width: '120px' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => fetchData(currentPage, pageSize)}>
                        {t('admin.attendance.filter')}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon={<DownloadOutlined/>} onClick={exportToExcel}>
                        {t('admin.attendance.export')}
                    </Button>
                </Form.Item>
            </Form>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => `${record.rfidCode}-${record.attendanceTimeIn}`}
                    pagination={false}
                />
            )}

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                style={{ marginTop: 20, textAlign: 'center' }}
            />
        </OutletTemplate>
    );
};

export default AttendancePage;