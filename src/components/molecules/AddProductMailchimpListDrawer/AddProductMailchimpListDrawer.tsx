'use client';

import { Button, Drawer, Flex, Select, Typography } from 'antd';
import { useGetMailchimpLists, useGetMailchimpListTags, useSaveProductMailchimpList } from 'hooks';
import React from 'react';

interface AddProductMailchimpListDrawerProps {
    open: boolean;
    handleClose: () => void;
    productId: string;
}

export const AddProductMailchimpListDrawer: React.FC<AddProductMailchimpListDrawerProps> = ({
    productId,
    open,
    handleClose,
}) => {
    const [selectedListId, setSelectedListId] = React.useState<string>();

    const { data: mailchimpLists } = useGetMailchimpLists();

    const { mutate: saveListToProduct } = useSaveProductMailchimpList();

    const handleSave = () => {
        if (!selectedListId) return;
        saveListToProduct({
            productId,
            listId: selectedListId,
        });
    };

    return (
        <Drawer
            title="Adicionar lista do mailchimp"
            open={open}
            onClose={handleClose}
            footer={
                <Flex gap={8} justify="space-between">
                    <Button block danger onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button block type="primary" onClick={handleSave}>
                        Salvar alterações
                    </Button>
                </Flex>
            }
        >
            <Flex vertical gap={16}>
                <Typography.Text>
                    Selecione a lista na qual o usuário será adicionado no momento da compra:
                </Typography.Text>
                <Select
                    onChange={(value) => {
                        setSelectedListId(value as string);
                    }}
                    options={mailchimpLists?.lists.map(({ name, id }) => ({ label: name, value: id }))}
                />
                <Typography.Text type="danger">
                    Lembre-se que se você adicionar uma lista aqui e depois removê-la no mailchimp, deverá também
                    atualizar a devida lista por aqui. Do contrário, haverão problemas na hora da compra
                </Typography.Text>
            </Flex>
        </Drawer>
    );
};
