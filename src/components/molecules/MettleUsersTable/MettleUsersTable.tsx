'use client';

import { Table, Modal, Tag, Drawer, Form, Input, Button, Select, Flex, Typography } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { fromUnixTime } from 'date-fns';
import {
    useDeleteMettleUser,
    useGetMailchimpLists,
    useGetMailchimpListTags,
    useGetMettleUsers,
    useMakeUserAdmin,
    useUpdateMettleUser,
    useUpdateMettleUserMailchimpTags,
} from 'hooks';
import {
    IMettleUser,
    IUpdateUserDataDTO,
    IUpdateUserMailchimpTagsDTO,
    IUserPerformanceData,
    QueryParams,
} from 'interfaces';
import { useRouter } from 'next/navigation';
import { useNotificationsContext } from 'providers';
import React, { useEffect, useState } from 'react';
import { ActionsDropdown, Text } from '../../atoms';

interface UseTableColumnsProps {
    isSearchMode?: boolean;
    onAction: (action: string, record: IMettleUser) => void;
}

const useTableColumns = ({ isSearchMode, onAction }: UseTableColumnsProps) => {
    const router = useRouter();
    const { showNotification } = useNotificationsContext();
    const deleteMettleUser = useDeleteMettleUser();
    const makeUserAdmin = useMakeUserAdmin();

    const handleMakeUserAdmin = (userUid: string) => {
        makeUserAdmin.mutate(userUid, {
            onSuccess: () => {
                showNotification('success', 'Successo', 'Usuário promovido com sucesso');
            },
            onError: (error) => {
                showNotification('error', 'Erro', error.message || 'Algo deu errado. Tente novamente mais tarde.');
            },
        });
    };

    const handleDeleteUser = (userUid: string, shouldSendEmailNotification: boolean) => {
        deleteMettleUser.mutate(
            { userUid, shouldSendEmailNotification },
            {
                onSuccess: () => {
                    showNotification('success', 'Successo', 'Usuário removido com sucesso');
                },
                onError: (error) => {
                    showNotification('error', 'Erro', error.message || 'Algo deu errado. Tente novamente mais tarde.');
                },
            },
        );
    };

    const columns: ColumnsType<IMettleUser> = [
        {
            title: 'Email',
            dataIndex: 'userData',
            key: 'email',
            render: (value) => value?.email,
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por e-mail',
            },
        },
        {
            title: 'Nome',
            dataIndex: 'userData',
            key: 'firstName',
            render: (value) => value?.firstName,
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por nome',
            },
        },
        {
            title: 'Sobrenome',
            dataIndex: 'userData',
            key: 'lastName',
            render: (value) => value?.lastName,
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por nome',
            },
        },
        {
            title: 'Iniciou o DEDA',
            dataIndex: 'accountStatus',
            key: 'isDedaStartConfirmed',
            render: (value) => (value?.dedaStart?.isDedaStartConfirmed ? 'Sim' : 'Não'),
            filters: !isSearchMode
                ? [
                      { value: true, text: 'Sim' },
                      { value: false, text: 'Não' },
                  ]
                : undefined,
            filterMultiple: false,
        },
        {
            title: 'Tags do Mailchimp',
            dataIndex: 'metadata',
            key: 'mailchimpTags',
            render: (_, { metadata }) =>
                !metadata
                    ? '-'
                    : metadata?.mailchimp?.tags?.length === 0
                      ? '-'
                      : metadata?.mailchimp?.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>),
        },
        {
            title: 'Performance geral (%)',
            dataIndex: 'performanceData',
            key: 'performanceData',
            render: (performanceData: IUserPerformanceData) =>
                performanceData ? `${performanceData.generalStats.overall.toFixed(2)}%` : '-',
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
            title: 'Data da última atividade',
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
            render: (userData, record) => (
                <ActionsDropdown
                    items={[
                        {
                            key: 'editUserData',
                            label: 'Editar dados do usuário',
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                onAction('editUserData', record);
                            },
                        },
                        {
                            key: 'editMailchimpTags',
                            label: 'Editar tags do Mailchimp',
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                onAction('editMailchimpTags', record);
                            },
                        },
                        {
                            disabled: true,
                            key: 'viewProfile',
                            label: 'Perfil do usuário',
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                router.push(`/profile/${userData.uid}`);
                            },
                        },
                        {
                            key: 'makeAdmin',
                            label: 'Tornar administrador da Mettle',
                            onClick: ({ domEvent }) => {
                                domEvent.preventDefault();
                                Modal.confirm({
                                    title: 'Tornar usuário administrador',
                                    content:
                                        'Este usuário terá permissões de administrador e poderá acessar o Backoffice. Deseja continuar?',
                                    okText: 'Sim',
                                    okButtonProps: {
                                        type: 'primary',
                                    },
                                    cancelText: 'Não',
                                    onOk: () => handleMakeUserAdmin(userData.uid),
                                });
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

                                let shouldSendEmail = true;

                                Modal.confirm({
                                    title: 'Remover usuário',
                                    content: (
                                        <Flex vertical style={{ paddingBottom: '1rem' }} gap={16}>
                                            <Typography.Text strong>
                                                Você tem certeza que deseja remover este usuário? Esta ação não poderá
                                                ser revertida.
                                            </Typography.Text>

                                            <Typography.Text strong>
                                                Atenção! Deseja enviar e-mail de despedida?
                                            </Typography.Text>
                                            <Select
                                                options={[
                                                    { label: 'Sim, enviar', value: true },
                                                    { label: 'Não enviar', value: false },
                                                ]}
                                                defaultValue={shouldSendEmail}
                                                onChange={(value) => {
                                                    shouldSendEmail = value;
                                                }}
                                            />
                                        </Flex>
                                    ),
                                    okText: 'Remover usuário',
                                    okButtonProps: {
                                        danger: true,
                                    },
                                    cancelText: 'Manter usuário',
                                    onOk: () => handleDeleteUser(userData.uid, shouldSendEmail),
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

export const MettleUsersTable = ({ searchValue }: { searchValue?: string }) => {
    const [queryParams, setQueryParams] = useState<QueryParams>({
        pageOffset: 1,
        pageSize: 10,
    });

    const { data: mettleUsers, isLoading } = useGetMettleUsers(queryParams);

    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isEditMailchimpTagsDrawerOpen, setIsEditMailchimpTagsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IMettleUser | null>(null);

    const onAction = (action: string, record: IMettleUser) => {
        if (action === 'editUserData') {
            setSelectedUser(record);
            setIsEditDrawerOpen(true);
        }
        if (action === 'editMailchimpTags') {
            setSelectedUser(record);
            setIsEditMailchimpTagsDrawerOpen(true);
        }
    };

    const usersColumns = useTableColumns({ isSearchMode: !!searchValue, onAction });

    useEffect(() => {
        setQueryParams((previous) => ({
            pageOffset: 1,
            pageSize: previous.pageSize,
            q: !!searchValue ? searchValue : undefined,
        }));
    }, [searchValue]);

    const [editUserForm] = Form.useForm();
    const updateMettleUserData = useUpdateMettleUser();

    const handleCloseEditDrawer = () => {
        setIsEditDrawerOpen(false);
        setSelectedUser(null);
        editUserForm.resetFields();
    };

    const handleEditUserFormSubmission = (values: AnyObject) => {
        const editUserDTO: IUpdateUserDataDTO = {};

        if (values.firstName && values.firstName !== selectedUser?.userData?.firstName) {
            editUserDTO.firstName = values.firstName.trim();
        }

        if (values.lastName && values.lastName !== selectedUser?.userData?.lastName) {
            editUserDTO.lastName = values.lastName.trim();
        }

        if (values.email && values.email !== selectedUser?.userData?.email) {
            editUserDTO.email = values.email.trim();
        }

        if (Object.keys(editUserDTO).length === 0) {
            handleCloseEditDrawer();
            return;
        }

        updateMettleUserData.mutate(
            { userUid: selectedUser?.userData?.uid as string, payloadData: editUserDTO },
            {
                onSuccess: () => {
                    handleCloseEditDrawer();
                },
            },
        );
    };

    const [editMailchimpTagsForm] = Form.useForm();
    const mailchimpListId = Form.useWatch('mailchimpListId', editMailchimpTagsForm);

    const { data: mailchimpLists } = useGetMailchimpLists();
    const { data: mailchimpTags, isLoading: isMailchimpTagsLoading } = useGetMailchimpListTags(mailchimpListId);

    const handleCloseMailchimpTagsEditDrawer = () => {
        setIsEditMailchimpTagsDrawerOpen(false);
        setSelectedUser(null);
        editMailchimpTagsForm.resetFields();
    };

    const updateUserMailchimpTags = useUpdateMettleUserMailchimpTags();

    const handleMailchimpTagsEditSubmit = (values: AnyObject) => {
        const currentTags = selectedUser?.metadata?.mailchimp?.tags || [];

        const newTags = values.mailchimpTags.map((tag: string) => ({
            name: tag,
            status: 'active',
        }));

        currentTags.forEach((currentTag) => {
            if (!newTags.find((tag: { name: string; status: string }) => tag.name === currentTag)) {
                newTags.push({
                    name: currentTag,
                    status: 'inactive',
                });
            }
        });

        const dto: IUpdateUserMailchimpTagsDTO = {
            listId: mailchimpListId,
            tags: newTags,
        };

        updateUserMailchimpTags.mutate(
            { userUid: selectedUser?.userData?.uid as string, dto },
            {
                onSuccess: () => {
                    handleCloseMailchimpTagsEditDrawer();
                },
            },
        );
    };

    useEffect(() => {
        if (isEditDrawerOpen) {
            editUserForm.setFieldsValue({
                firstName: selectedUser?.userData?.firstName,
                lastName: selectedUser?.userData?.lastName,
                email: selectedUser?.userData?.email,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditDrawerOpen]);

    useEffect(() => {
        if (isEditMailchimpTagsDrawerOpen) {
            editMailchimpTagsForm.setFieldsValue({
                mailchimpListId: selectedUser?.metadata?.mailchimp?.listId,
                mailchimpTags: selectedUser?.metadata?.mailchimp?.tags,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMailchimpTagsDrawerOpen]);

    return (
        <>
            <Table
                rowKey={(record) => {
                    if (!record.userData?.uid) {
                        console.error('no-key', record);
                    }
                    return record?.userData?.uid ?? 'no-key';
                }}
                loading={isLoading}
                dataSource={mettleUsers?.data?.filter((el) => !!el.userData) || []}
                columns={usersColumns as ColumnsType<AnyObject>}
                onChange={(pagination, filters, sorter) => {
                    const { isDedaStartConfirmed } = filters;

                    const appliedFilters: {
                        sortBy?: string;
                        isDedaStartConfirmed_eq?: string;
                        pageOffset?: number;
                        pageSize?: number;
                    } = {
                        pageOffset: pagination.current,
                        pageSize: pagination.pageSize,
                    };

                    if ((sorter as SorterResult<any>)?.columnKey) {
                        appliedFilters.sortBy = `${(sorter as SorterResult<any>)?.columnKey}_${
                            (sorter as SorterResult<any>)?.order === 'ascend' ? 'asc' : 'desc'
                        }`;
                    }

                    if (isDedaStartConfirmed) {
                        appliedFilters.isDedaStartConfirmed_eq = isDedaStartConfirmed.toString();
                    }

                    setQueryParams(appliedFilters);
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
                            pageOffset: offset,
                            pageSize,
                        }));
                    },
                }}
            />
            <Drawer
                onClose={handleCloseMailchimpTagsEditDrawer}
                open={isEditMailchimpTagsDrawerOpen}
                footer={
                    <Button
                        loading={updateUserMailchimpTags.isPending}
                        type="primary"
                        block
                        size="large"
                        onClick={() => {
                            editMailchimpTagsForm.submit();
                        }}
                    >
                        Salvar
                    </Button>
                }
            >
                {isEditMailchimpTagsDrawerOpen && selectedUser && (
                    <Form form={editMailchimpTagsForm} layout="vertical" onFinish={handleMailchimpTagsEditSubmit}>
                        <Form.Item
                            name="mailchimpListId"
                            label="Lista do Mailchimp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, selecione a lista do Mailchimp',
                                },
                            ]}
                        >
                            <Select
                                defaultValue={selectedUser?.metadata?.mailchimp?.listId}
                                options={mailchimpLists?.lists.map(({ name, id }) => ({ label: name, value: id }))}
                            />
                        </Form.Item>
                        <Form.Item name="mailchimpTags" label="Tags do usuário">
                            <Select
                                mode="tags"
                                allowClear
                                defaultValue={selectedUser?.metadata?.mailchimp?.tags}
                                loading={isMailchimpTagsLoading}
                                options={mailchimpTags?.tags.map((tag) => ({ label: tag.name, value: tag.name }))}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
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
                            <Input type="text" defaultValue={selectedUser?.userData?.firstName} />
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
                            <Input type="text" defaultValue={selectedUser?.userData?.lastName} />
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
                            <Input type="email" defaultValue={selectedUser?.userData?.email} />
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

// TODO - Refactor this component and split functionalities
