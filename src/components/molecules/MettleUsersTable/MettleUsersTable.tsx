'use client';

import { Table, Modal } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from 'antd/es/table';
import { fromUnixTime } from 'date-fns';
import { useDeleteMettleUser, useGetMettleUsers } from 'hooks';
import { IMettleUser, QueryParams } from 'interfaces';
import { useRouter } from 'next/navigation';
import { useNotificationsContext } from 'providers';
import { useState } from 'react';
import { ActionsDropdown, Text } from '../../atoms';

const useTableColumns = () => {
    const router = useRouter();
    const { showNotification } = useNotificationsContext();
    const deleteMettleUser = useDeleteMettleUser();

    const handleDeleteUser = (userUid: string) => {
        deleteMettleUser.mutate(userUid, {
            onSuccess: () => {
                showNotification('success', 'Successo', 'Usuário removido com sucesso');
            },
            onError: (error) => {
                showNotification('error', 'Erro', error.message || 'Algo deu errado. Tente novamente mais tarde.');
            },
        });
    };

    const columns: ColumnsType<IMettleUser> = [
        {
            title: 'E-mail',
            dataIndex: 'userData',
            render: (value) => value?.email,
        },
        {
            title: 'Nome',
            dataIndex: 'userData',
            render: (value) => `${value?.firstName} ${value?.lastName}`,
        },
        {
            title: 'Iniciou o DEDA',
            dataIndex: 'accountStatus',
            render: (value) => (value?.dedaStart?.isDedaStartConfirmed ? 'Sim' : 'Não'),
        },
        {
            title: 'Data de criação',
            dataIndex: 'accountStatus',
            render: (accountStatus) =>
                fromUnixTime(accountStatus.purchaseDate._seconds)?.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) || '-',
        },
        {
            title: 'Data do último input',
            dataIndex: 'userHistory',
            render: (userHistory) =>
                userHistory?.lastInputDate
                    ? fromUnixTime(userHistory?.lastInputDate._seconds)?.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                      })
                    : '-',
        },
        {
            key: 'tableActions',
            dataIndex: 'userData',
            render: (userData) => (
                <ActionsDropdown
                    items={[
                        {
                            key: 'viewProfile',
                            label: 'Perfil do usuário',
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                router.push(`/profile/${userData.uid}`);
                            },
                        },
                        {
                            key: 'deleteUser',
                            label: (
                                <Text level="span" fontColor="danger">
                                    Remover usuário
                                </Text>
                            ),
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                Modal.confirm({
                                    title: 'Remover usuário',
                                    content:
                                        'Você tem certeza que deseja remover este usuário? Esta ação não poderá ser revertida.',
                                    okText: 'Sim',
                                    okButtonProps: {
                                        danger: true,
                                    },
                                    cancelText: 'Não',
                                    onOk: () => handleDeleteUser(userData.uid),
                                });
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return columns;
};

export const MettleUsersTable = () => {
    const [queryParams, setQueryParams] = useState<QueryParams>({
        pageOffset: 1,
        pageSize: 10,
    });

    const { data: mettleUsers, isLoading } = useGetMettleUsers(queryParams);

    const usersColumns = useTableColumns();

    return (
        <Table
            rowKey={(record) => record.userData.uid}
            loading={isLoading}
            dataSource={mettleUsers?.data || []}
            columns={usersColumns as ColumnsType<AnyObject>}
            pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30'],
                defaultCurrent: 1,
                total: mettleUsers?.pagination.total || 0,
                showTotal: () => <span>Total: {mettleUsers?.pagination.total || 0}</span>,
                onChange: (offset, pageSize) => {
                    setQueryParams((previous) => ({
                        ...previous,
                        pageOffset: offset,
                        pageSize,
                    }));
                },
            }}
        />
    );
};
