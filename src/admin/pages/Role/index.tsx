import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRoles } from '../../services/roleSevice';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { Permission } from '../Permission';
import { LoadingOutlined } from '@ant-design/icons';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Role {
    id: string;
    name: string;
    description: string;
    rolePermissions: Permission[];
}

const RolePage: React.FC = () => {
    const [data, setData] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // State cho từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number, keyword: string) => {
        setIsLoading(true);
        try {
            const response = await getRoles(page, pageSize, 'name', keyword); // Gọi API với từ khóa
            if (!response.ok) {
                message.error(t('admin.message.fetchError')); // Thông báo khi lỗi
                return;
            }
            const result = await response.json();
            const content: Role[] = result.data.content;
            const roles = content.map((item: any) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(roles);
        } catch (error) {
            message.error(t('admin.message.fetchError')); // Thông báo khi có lỗi
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        const keywordFromUrl = searchParams.get('keyword') || ''; // Lấy từ khóa tìm kiếm từ URL

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl); // Cập nhật từ khóa tìm kiếm
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, searchKeyword); // Gọi fetchData với từ khóa tìm kiếm
    }, [currentPage, pageSize, searchKeyword]);

    const handleDelete = (id: string) => {
        setData(prevData => prevData.filter(item => item.id !== id));
        message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa thành công
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewRole = () => {
        navigate('create');
    };

    const handleDeleteSelected = (ids: React.Key[]) => {
        setData(prevData => prevData.filter(item => !ids.includes(item.id)));
        message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa nhiều thành công
    };

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${searchKeyword}`); // Cập nhật URL với page, pageSize và từ khóa
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`); // Cập nhật URL khi tìm kiếm
    };

    const dataListConfig: DataListConfig<Role> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Role, b: Role) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.role.roleColumn'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.role.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Role, b: Role) => a.description.localeCompare(b.description),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewRole,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        onDeleteSelected: handleDeleteSelected,
        search: {
            keyword: searchKeyword, // Truyền từ khóa tìm kiếm vào cấu hình
            onSearch: handleSearch, // Hàm tìm kiếm
        },
        pagination: {
            currentPage: currentPage,
            totalItems: totalItems,
            pageSize: pageSize,
            onPaginationChange: onPageChange,
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
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

export default RolePage;
