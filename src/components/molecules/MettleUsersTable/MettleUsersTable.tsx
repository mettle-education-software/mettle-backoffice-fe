'use client';

import { Table, Drawer, Form, Input, Button } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { AddProductToUserDrawer } from 'components/molecules/MettleUsersTable/AddProductToUserDrawer';
import { useGetMettleUsers, useUpdateMettleUser } from 'hooks';
import { IMettleUser, IUpdateUserDataDTO, QueryParams } from 'interfaces';
import { useNotificationsContext } from 'providers';
import React, { useEffect, useState } from 'react';
import styles from './MettleUsersTable.module.css';
import { useTableColumns } from './usersTableColumns';

export const MettleUsersTable = ({
    searchValue,
    isArchived = false,
}: {
    searchValue?: string;
    isArchived?: boolean;
}) => {
    const defaultParams: QueryParams = {
        offset: 0,
        limit: 10,
    };

    if (isArchived) defaultParams.accountStatusIn = 'ARCHIVED';
    else defaultParams.accountStatusNotIn = 'ARCHIVED';

    const [queryParams, setQueryParams] = useState<QueryParams>(defaultParams);

    const { data: mettleUsers, isLoading } = useGetMettleUsers(queryParams);

    const [selectedUser, setSelectedUser] = useState<IMettleUser | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const isEditDrawerOpen = selectedAction === 'editUserData';

    const onAction = (action: string, record: IMettleUser) => {
        setSelectedUser(record);
        setSelectedAction(action);
    };

    const usersColumns = useTableColumns({ isSearchMode: !!searchValue, onAction });

    useEffect(() => {
        setQueryParams((previous) => ({
            ...defaultParams,
            limit: previous.limit,
            searchQuery: !!searchValue ? searchValue : undefined,
        }));
    }, [searchValue]);

    const [editUserForm] = Form.useForm();
    const updateMettleUserData = useUpdateMettleUser();

    const handleCloseEditDrawer = () => {
        setSelectedAction(null);
        setSelectedUser(null);
        editUserForm.resetFields();
    };

    const handleEditUserFormSubmission = (values: AnyObject) => {
        const editUserDTO: IUpdateUserDataDTO = {};

        if (values.firstName && values.firstName !== selectedUser?.first_name) {
            editUserDTO.firstName = values.firstName.trim();
        }

        if (values.lastName && values.lastName !== selectedUser?.last_name) {
            editUserDTO.lastName = values.lastName.trim();
        }

        if (values.email && values.email !== selectedUser?.email) {
            editUserDTO.email = values.email.trim();
        }

        if (Object.keys(editUserDTO).length === 0) {
            handleCloseEditDrawer();
            return;
        }

        updateMettleUserData.mutate(
            { userUid: selectedUser?.user_uid as string, payloadData: editUserDTO },
            {
                onSuccess: () => {
                    handleCloseEditDrawer();
                },
            },
        );
    };

    useEffect(() => {
        if (isEditDrawerOpen) {
            editUserForm.setFieldsValue({
                firstName: selectedUser?.first_name,
                lastName: selectedUser?.last_name,
                email: selectedUser?.email,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditDrawerOpen]);

    const { showNotification } = useNotificationsContext();

    const copyUserUid = async (userUid: string) => {
        await navigator.clipboard.writeText(userUid);
        showNotification('success', 'Sucesso!', 'ID do usuário copiado para a área de transferência');
    };

    return (
        <div style={{ width: '100%' }}>
            <Table
                scroll={{ x: 'max-content' }}
                rowClassName={styles.row}
                rowKey={(record) => {
                    if (!record?.user_uid) {
                        console.error('no-key', record);
                    }
                    return record?.user_uid ?? 'no-key';
                }}
                onRow={(record) => ({
                    onClick: () => {
                        copyUserUid(record?.user_uid as string).catch((error) => {
                            showNotification(
                                'error',
                                'Erro!',
                                error.message || 'Algo deu errado. Tente novamente mais tarde.',
                            );
                        });
                    },
                })}
                loading={isLoading}
                dataSource={mettleUsers?.data || []}
                columns={usersColumns as ColumnsType<AnyObject>}
                onChange={(pagination, _, sorter) => {
                    const appliedFilters: {
                        orderBy?: string;
                        offset?: number;
                        limit?: number;
                    } = {
                        offset:
                            !!pagination?.pageSize && !!pagination?.current
                                ? pagination?.current * pagination?.pageSize - pagination?.pageSize
                                : 0,
                        limit: pagination.pageSize,
                    };

                    if ((sorter as SorterResult<any>)?.columnKey) {
                        appliedFilters.orderBy = `${(sorter as SorterResult<any>)?.columnKey}.${
                            (sorter as SorterResult<any>)?.order === 'ascend' ? 'ASC' : 'DESC'
                        }`;
                    }

                    setQueryParams({
                        ...defaultParams,
                        ...appliedFilters,
                    });
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30'],
                    defaultCurrent: 1,
                    total: mettleUsers?.pagination.total || 0,
                    showTotal: () => <span>Total: {mettleUsers?.pagination.total || 0}</span>,
                    onChange: (offset, pageSize) => {
                        setQueryParams((previous) => ({
                            ...previous,
                            offset: offset * pageSize - pageSize,
                            limit: pageSize,
                        }));
                    },
                }}
            />
            <Drawer
                onClose={handleCloseEditDrawer}
                open={isEditDrawerOpen}
                title="Editar informações do usuário"
                size="large"
                footer={
                    <Button
                        loading={updateMettleUserData.isPending}
                        type="primary"
                        block
                        size="large"
                        onClick={() => {
                            editUserForm.submit();
                        }}
                    >
                        Salvar
                    </Button>
                }
            >
                {isEditDrawerOpen && selectedUser && (
                    <Form layout="vertical" form={editUserForm} onFinish={handleEditUserFormSubmission}>
                        <Form.Item
                            name="firstName"
                            label="Nome"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, insira o nome do usuário',
                                },
                            ]}
                        >
                            <Input type="text" defaultValue={selectedUser?.first_name} />
                        </Form.Item>
                        <Form.Item
                            name="lastName"
                            label="Sobrenome"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, insira o sobrenome do usuário',
                                },
                            ]}
                        >
                            <Input type="text" defaultValue={selectedUser?.first_name} />
                        </Form.Item>
                        <Form.Item
                            validateDebounce={800}
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, insira o e-mail do usuário',
                                },
                                {
                                    type: 'email',
                                    message: 'Por favor, insira um e-mail válido',
                                },
                            ]}
                        >
                            <Input type="email" defaultValue={selectedUser?.email} />
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
            <AddProductToUserDrawer
                mettleUser={selectedUser}
                open={selectedAction === 'addProducts'}
                onClose={() => {
                    setSelectedAction(null);
                }}
            />
        </div>
    );
};
