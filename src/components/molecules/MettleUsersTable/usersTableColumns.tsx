import { Flex, Modal, Select, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ActionsDropdown, Text } from 'components';
import { useDeleteMettleUser, useMakeUserAdmin } from 'hooks';
import { IMettleUser, MelpStatus, MelpStatusEnum } from 'interfaces';
import { useRouter } from 'next/navigation';
import { useNotificationsContext } from 'providers';
import React from 'react';

interface UseTableColumnsProps {
    isSearchMode?: boolean;
    onAction: (action: string, record: IMettleUser) => void;
}

export const useTableColumns = ({ isSearchMode, onAction }: UseTableColumnsProps) => {
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
            dataIndex: 'email',
            key: 'email',
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por e-mail',
            },
        },
        {
            title: 'Nome',
            dataIndex: 'first_name',
            key: 'first_name',
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por nome',
            },
        },
        {
            title: 'Sobrenome',
            dataIndex: 'last_name',
            key: 'last_name',
            sorter: !isSearchMode,
            showSorterTooltip: {
                title: 'Clique para ordenar por nome',
            },
        },
        {
            title: 'Status da conta',
            dataIndex: 'status',
            render: (value) => <Tag>{value}</Tag>,
        },
        {
            title: 'IMERSO Status',
            dataIndex: 'melp_status',
            key: 'melp_status',
            render: (value) => <Tag>{MelpStatusEnum[value as MelpStatus]}</Tag>,
            // filters: !isSearchMode
            //     ? [
            //           { value: true, text: 'Sim' },
            //           { value: false, text: 'Não' },
            //       ]
            //     : undefined,
            // filterMultiple: false,
        },
        {
            title: 'Tags do Mailchimp',
            dataIndex: 'metadata',
            key: 'mailchimpTags',
            render: (_, { mailchimp_metadata }) =>
                !mailchimp_metadata || mailchimp_metadata.tags?.length === 0
                    ? '-'
                    : mailchimp_metadata.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>),
        },
        {
            title: 'Performance geral (%)',
            dataIndex: 'overall_performance',
            key: 'overall_performance',
            render: (value) => (value ? `${value.toFixed(2)}%` : '-'),
        },
        {
            title: 'Data de criação',
            dataIndex: 'created_at',
            render: (value) => new Date(value).toLocaleDateString() || '-',
        },
        {
            title: 'Data do último login',
            dataIndex: 'last_login',
            key: 'last_login',
            render: (value) => (!value ? 'Não fez login' : new Date(value).toLocaleDateString()),
        },
        {
            title: 'Data da última atividade',
            dataIndex: 'last_time_active',
            render: (value) => (!value ? '-' : new Date(value).toLocaleDateString()),
        },
        {
            key: 'tableActions',
            dataIndex: 'user_uid',
            render: (user_uid, record) =>
                record.status === 'ARCHIVED' ? null : (
                    <ActionsDropdown
                        onClick={(e) => e.stopPropagation()}
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
                                    router.push(`/profile/${user_uid}`);
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
                                        onOk: () => handleMakeUserAdmin(user_uid),
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
                                                    Você tem certeza que deseja remover este usuário? Esta ação não
                                                    poderá ser revertida.
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
                                        onOk: () => handleDeleteUser(user_uid, shouldSendEmail),
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
