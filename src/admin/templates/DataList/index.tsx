import React, { useState } from 'react';
import { Table, Button, Input, Row, Col, Space, Popconfirm, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { ColumnType, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useTranslation } from 'react-i18next';
import "./DataList.scss";

export interface DataListConfig<T> {
    columns: TableColumnsType<T>;
    data: T[];
    rowKey: string;
    onCreateNew?: () => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onDeleteSelected?: (ids: React.Key[]) => void; // Optional for bulk delete
    search?: {
        keyword?: string;
        onSearch: (value: string) => void;
    };
    pagination?: {
        totalItems: number;
        currentPage: number;
        pageSize: number;
        onPaginationChange?: (page: number, pageSize: number, keyword?: string) => void;
    };
}

const DataListTemplate = <T extends { id: string }>({
                                                        config,
                                                    }: { config: DataListConfig<T> }): JSX.Element => {
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>(config.search?.keyword || '');
    const { t } = useTranslation();

    const handleTableChange = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _pagination: TablePaginationConfig,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _filters: Record<string, FilterValue | null>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _sorter: SorterResult<T> | SorterResult<T>[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _extra: TableCurrentDataSource<T>
    ) => { };

    const handleSearchEnter = () => {
        if (config.search) {
            config.search.onSearch(searchKeyword);
        }
    };

    const actionColumn: ColumnType<T> = {
        title: t('admin.dataList.actionColumn'),
        key: 'action',
        render: (record: T) => (
            <Space className="data-list__action-buttons">
                <Button className="data-list__action-button data-list__action-button--edit" icon={<EditOutlined />} onClick={() => config.onUpdate(record.id)} />
                <Popconfirm
                    title={t('admin.dataList.deleteConfirm')}
                    onConfirm={() => config.onDelete(record.id)}
                    okText={t('admin.dataList.deleteSelectedConfirm')}
                    cancelText={t('admin.dataList.deleteSelectedCancel')}
                >
                    <Button className="data-list__action-button data-list__action-button--delete" icon={<DeleteOutlined />} danger />
                </Popconfirm>
            </Space>
        ),
    };

    return (
        <>
            <Row justify="space-between" className="data-list__header">
                <Col>
                    {
                        config.onCreateNew &&
                        <Button className="data-list__create-button" type="primary" icon={<PlusOutlined />} onClick={config.onCreateNew}>
                            {t('admin.dataList.createNewButton')}
                        </Button>
                    }
                </Col>
                <Col>
                    {config.search && (
                        <Input
                            className="data-list__search-input"
                            placeholder={t('admin.dataList.searchPlaceholder')}
                            value={searchKeyword}
                            onPressEnter={handleSearchEnter}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    )}
                </Col>
            </Row>

            <Table<T>
                className="data-list__table"
                columns={[...config.columns, actionColumn]}
                dataSource={config.data}
                rowKey={config.rowKey}
                pagination={false}
                onChange={handleTableChange}
                rowSelection={
                    config.onDeleteSelected ? {
                        selectedRowKeys: selectedIds,
                        onChange: (keys) => setSelectedIds(keys),
                    } : undefined // Only enable row selection if onDeleteSelected is defined
                }
            />

            <Row justify="space-between" className="data-list__footer" style={{ marginTop: '16px' }}>
                <Col>
                    {config.onDeleteSelected && (
                        <Popconfirm
                            title={t('admin.dataList.deleteConfirm')}
                            onConfirm={() => config.onDeleteSelected && config.onDeleteSelected(selectedIds)}
                            okText={t('admin.dataList.deleteSelectedConfirm')}
                            cancelText={t('admin.dataList.deleteSelectedCancel')}
                        >
                            <Button
                                className="data-list__delete-selected-button"
                                type="primary"
                                danger
                                disabled={selectedIds.length === 0}
                            >
                                {t('admin.dataList.deleteSelectedButton')}
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
                <Col>
                    {config.pagination &&
                        <Pagination
                            current={config.pagination.currentPage || 1}
                            total={config.pagination.totalItems}
                            pageSize={config.pagination.pageSize}
                            showSizeChanger
                            pageSizeOptions={['5', '10', '20', '50', '100']}
                            onChange={(page, pageSize) => {
                                if (config.pagination && config.pagination.onPaginationChange) {
                                    config.pagination.onPaginationChange(page, pageSize || config.pagination.pageSize, searchKeyword);
                                }
                            }}
                        />
                    }
                </Col>
            </Row>
        </>
    );
};

export default DataListTemplate;