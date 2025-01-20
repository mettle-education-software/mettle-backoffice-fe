'use client';

import { Table } from 'antd';
import { useGetMettleProducts } from 'hooks';
import React from 'react';
import { useMettleProductsTableColumns } from './mettleProductsTableColumns';

export const MettleProductsTable: React.FC = () => {
    const { data, isLoading, isRefetching } = useGetMettleProducts();

    const { columns, isActionLoading } = useMettleProductsTableColumns();

    return (
        <Table
            style={{ width: '100%' }}
            rowKey="productUuid"
            loading={isLoading || isRefetching || isActionLoading}
            columns={columns}
            dataSource={data?.data || []}
        />
    );
};
