import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { deleteUser, getUsers } from '../../services/userService.tsx';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface User {
    id: string;
    createdDate: Date;
    modifiedDate: Date;
    username: string;
    className: string;
    email: string;
    gender: string;
    phone: string;
    rfidCode: string;
    studentCode: string;
}

const UserPage: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number, keyword?: string) => {
        setIsLoading(true);
        try {
            const response = await getUsers(page, pageSize, 'username', keyword);
            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            console.log(result);
            const content: User[] = result.data.content;
            const users = content.map((item) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(users);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        const keywordFromUrl = searchParams.get('keyword') || '';

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl);

        fetchData(pageFromUrl, pageSizeFromUrl, keywordFromUrl);
    }, [location.search]);

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await deleteUser([id]);
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

    const onPageChange = (page: number, pageSize?: number) => {
        const keyword = searchKeyword || '';
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${keyword}`);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`);
    };

    const dataListConfig: DataListConfig<User> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: User, b: User) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.user.username'),
                dataIndex: 'username',
                key: 'username',
                sorter: (a: User, b: User) => a.username.localeCompare(b.username),
            },
            {
                title: t('admin.user.email'),
                dataIndex: 'email',
                key: 'email',
                sorter: (a: User, b: User) => (a.email || '').localeCompare(b.email || ''),
            },
            {
                title: t('admin.user.phone'),
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: t('admin.user.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: t('admin.user.className'),
                dataIndex: 'className',
                key: 'className',
            },
            {
                title: t('admin.user.rfidCode'),
                dataIndex: 'rfidCode',
                key: 'rfidCode',
            },
            {
                title: t('admin.user.studentCode'),
                dataIndex: 'studentCode',
                key: 'studentCode',
            },
        ],
        data: data,
        rowKey: 'id',
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        search: {
            keyword: searchKeyword,
            onSearch: handleSearch,
        },
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
                { path: `${PREFIX_URL_ADMIN}/users`, name: t('admin.user.title') },
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

export default UserPage;