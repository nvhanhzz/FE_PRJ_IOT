import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { deleteDevice, getDevices } from '../../services/deviceService';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Device {
    id: string;
    createdDate: Date;
    modifiedDate: Date;
    codeDevice: string;
    createdBy: string;
    location: string;
    modifiedBy: string;
    name: string;
}

const DevicePage: React.FC = () => {
    const [data, setData] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchData = async (page: number = 1, pageSize: number = 10) => {
        setIsLoading(true);
        try {
            const response = await getDevices(page, pageSize);
            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            const devices = result.data.content.map((item: Device) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(devices);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await deleteDevice([id]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => item.id !== id));
                message.success(t('admin.message.deleteSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewDevice = () => {
        navigate('create');
    };

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
    };

    const dataListConfig: DataListConfig<Device> = {
        columns: [
            { title: 'No.', dataIndex: 'key', render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize },
            { title: t('admin.device.name'), dataIndex: 'name', key: 'name', sorter: (a: Device, b: Device) => a.name.localeCompare(b.name) },
            { title: t('admin.device.codeDevice'), dataIndex: 'codeDevice', key: 'codeDevice' },
            { title: t('admin.device.location'), dataIndex: 'location', key: 'location' },
            { title: t('admin.device.createdBy'), dataIndex: 'createdBy', key: 'createdBy' },
            { title: t('admin.device.modifiedBy'), dataIndex: 'modifiedBy', key: 'modifiedBy' }
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewDevice,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        pagination: {
            currentPage: currentPage,
            totalItems: totalItems,
            pageSize: pageSize,
            onPaginationChange: onPageChange,
        },
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/devices`, name: t('admin.device.title') },
            ]}
        >
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <DataListTemplate config={dataListConfig} />
            )}
        </OutletTemplate>
    );
};

export default DevicePage;