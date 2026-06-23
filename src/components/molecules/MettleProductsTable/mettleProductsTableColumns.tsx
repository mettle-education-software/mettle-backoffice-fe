'use client';

import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteMettleProduct } from 'hooks';
import { MettleProduct } from 'interfaces';
import { useEffect, useState } from 'react';
import { ActionsDropdown } from '../../atoms';

const { Text } = Typography;

type Action = {
    key: string | null;
    data: Record<string, string | number | boolean | null | undefined>;
} | null;

export const useMettleProductsTableColumns: () => {
    columns: ColumnsType<MettleProduct>;
    isActionLoading: boolean;
    action: Action;
    defineAction: (action: Action) => void;
} = () => {
    const { mutate: deleteProduct, isPending } = useDeleteMettleProduct();

    const [isActionLoading, setIsActionLoading] = useState(isPending);

    const [action, setAction] = useState<Action>(null);

    const defineAction = (newAction: Action) => {
        setAction(newAction);
    };

    useEffect(() => {
        setIsActionLoading(isPending);
    }, [isPending]);

    return {
        isActionLoading,
        action,
        defineAction,
        columns: [
            {
                key: 'productName',
                dataIndex: 'productName',
                title: 'Título',
            },
            {
                key: 'productDescription',
                dataIndex: 'productDescription',
                title: 'Descrição',
            },
            {
                key: 'createdAt',
                dataIndex: 'createdAt',
                title: 'Criado em',
                render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
            },
            {
                key: 'updatedAt',
                dataIndex: 'updatedAt',
                title: 'Atualizado em',
                render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
            },
            {
                key: 'webhookEndpointHotmart',
                dataIndex: 'webhookEndpointHotmart',
                title: 'HOTMART webhook de compra bem sucedida (clique para copiar)',
                render: (value: string) => (
                    <Text
                        onClick={(event) => {
                            event.stopPropagation();
                            navigator.clipboard.writeText(value).then(() => {
                                alert('Copiado para a área de transferência!');
                            });
                        }}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Clique pra copiar
                    </Text>
                ),
            },
            {
                key: 'webhookEndpointHerospark',
                dataIndex: 'webhookEndpointHerospark',
                title: 'HEROSPARK webhook de compra bem sucedida (clique para copiar)',
                render: (value: string) => (
                    <Text
                        onClick={(event) => {
                            event.stopPropagation();
                            navigator.clipboard.writeText(value).then(() => {
                                alert('Copiado para a área de transferência!');
                            });
                        }}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Clique pra copiar
                    </Text>
                ),
            },
            {
                key: 'actions',
                render: (_, record) => {
                    return (
                        <ActionsDropdown
                            items={[
                                {
                                    key: 'delete',
                                    label: 'Apagar produto',
                                    onClick: () => {
                                        if (
                                            window.confirm(
                                                'Atenção! Essa ação não pode ser revertida e os usuários que compraram este produto perderão o acesso! Deseja continuar?',
                                            )
                                        ) {
                                            deleteProduct(record.productUuid);
                                        }
                                    },
                                },
                            ]}
                        />
                    );
                },
            },
        ],
    };
};
