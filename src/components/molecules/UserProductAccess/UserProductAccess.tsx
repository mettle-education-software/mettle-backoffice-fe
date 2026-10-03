'use client';

import { Button, Checkbox, Collapse, Flex, Input, Modal, Table, Tag, Typography } from 'antd';
import { format } from 'date-fns';
import { useGetUserProductAccess, useUpdateUserProductAccess } from 'hooks';
import { IUserProductAccess } from 'interfaces';
import React, { useState } from 'react';

const { Text } = Typography;

const PRODUCT_NAMES: Record<string, string> = {
    METTLE_STUDENT: 'Programa Imerso',
    'MASTERCLASS_"AS_7_REGRAS"_9c466a35-2685-4d1e-8434-b29044628056': 'Masterclass As 7 Regras',
};
const productName = (product: string) => PRODUCT_NAMES[product] ?? product;

const formatDate = (value: string | null) => (value ? format(new Date(value), 'dd/MM/yyyy') : '—');

export const stateBadge = (row: Pick<IUserProductAccess, 'state' | 'expiring' | 'refundedAt'>) => {
    if (row.state === 'none') return row.refundedAt ? <Tag color="red">Estornado</Tag> : <Tag>Sem acesso</Tag>;
    if (row.state === 'grace') return <Tag color="orange">Carência</Tag>;
    if (row.state === 'expired') return <Tag color="default">Expirado</Tag>;
    return row.expiring ? <Tag color="gold">Vencendo</Tag> : <Tag color="green">Ativo</Tag>;
};

export const UserProductAccess: React.FC<{ userUid: string }> = ({ userUid }) => {
    const { data, isLoading } = useGetUserProductAccess(userUid);
    const { mutate: updateAccess, isPending } = useUpdateUserProductAccess(userUid);

    const [editing, setEditing] = useState<IUserProductAccess | null>(null);
    const [date, setDate] = useState('');
    const [lifetime, setLifetime] = useState(false);
    const [reason, setReason] = useState('');

    const openEditor = (row: IUserProductAccess) => {
        setEditing(row);
        setDate(row.expiresAt ? format(new Date(row.expiresAt), 'yyyy-MM-dd') : '');
        setLifetime(row.expiresAt === null && row.state !== 'none');
        setReason('');
    };

    const canSave = reason.trim().length >= 3 && (lifetime || !!date);

    const save = () => {
        if (!editing || !canSave) return;
        updateAccess(
            {
                product: editing.product,
                // fim do dia no horário de Brasília
                expiresAt: lifetime ? null : new Date(`${date}T23:59:59-03:00`).toISOString(),
                reason: reason.trim(),
            },
            { onSuccess: () => setEditing(null) },
        );
    };

    return (
        <Flex vertical gap={16}>
            <Text strong style={{ fontSize: '1.25rem' }}>
                Acessos
            </Text>
            <Table
                rowKey="product"
                loading={isLoading}
                pagination={false}
                dataSource={data?.products ?? []}
                locale={{ emptyText: 'Nenhuma validade registrada ainda para este usuário.' }}
                columns={[
                    { title: 'Produto', dataIndex: 'product', render: productName },
                    { title: 'Estado', key: 'state', render: (_, row) => stateBadge(row) },
                    {
                        title: 'Validade',
                        dataIndex: 'expiresAt',
                        render: (value: string | null, row) =>
                            value === null && row.state !== 'none' ? 'Vitalício' : formatDate(value),
                    },
                    { title: 'Carência até', dataIndex: 'graceUntil', render: formatDate },
                    { title: 'Origem', dataIndex: 'source' },
                    {
                        title: '',
                        key: 'actions',
                        render: (_, row) => <Button onClick={() => openEditor(row)}>Estender/alterar validade</Button>,
                    },
                ]}
            />
            <Collapse
                items={[
                    {
                        key: 'log',
                        label: `Histórico de alterações (${data?.log.length ?? 0})`,
                        children: (
                            <Table
                                rowKey="id"
                                size="small"
                                pagination={false}
                                dataSource={data?.log ?? []}
                                columns={[
                                    {
                                        title: 'Quando',
                                        dataIndex: 'at',
                                        render: (v: string) => format(new Date(v), 'dd/MM/yyyy HH:mm'),
                                    },
                                    { title: 'Produto', dataIndex: 'product', render: productName },
                                    { title: 'Quem', dataIndex: 'actor' },
                                    { title: 'Motivo', dataIndex: 'reason' },
                                    {
                                        title: 'Validade depois',
                                        key: 'after',
                                        render: (_, entry) => formatDate((entry.after?.expires_at as string) ?? null),
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
            <Modal
                open={!!editing}
                title={editing ? `Validade — ${productName(editing.product)}` : ''}
                okText="Salvar"
                cancelText="Cancelar"
                onOk={save}
                okButtonProps={{ disabled: !canSave, loading: isPending }}
                onCancel={() => setEditing(null)}
            >
                <Flex vertical gap={12}>
                    <Checkbox checked={lifetime} onChange={(e) => setLifetime(e.target.checked)}>
                        Vitalício
                    </Checkbox>
                    <label htmlFor="product-access-date">
                        <Text>Acesso até</Text>
                        <Input
                            id="product-access-date"
                            type="date"
                            value={date}
                            disabled={lifetime}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <label htmlFor="product-access-reason">
                        <Text>Motivo (obrigatório)</Text>
                        <Input.TextArea
                            id="product-access-reason"
                            rows={3}
                            value={reason}
                            maxLength={500}
                            placeholder="Ex.: cortesia combinada por e-mail; correção de data da compra"
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </label>
                    <Text type="secondary">
                        A alteração vale na hora e fica registrada no histórico. Uma data no passado deixa o acesso
                        expirado.
                    </Text>
                </Flex>
            </Modal>
        </Flex>
    );
};
