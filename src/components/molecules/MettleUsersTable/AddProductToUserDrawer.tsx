'use client';

import { Button, Drawer, DrawerProps, Flex, Select, Typography } from 'antd';
import { useApplyProductToUser, useGetMettleProducts } from 'hooks';
import { IMettleUser } from 'interfaces';
import React, { useState } from 'react';

const { Text } = Typography;

interface AddProductToUserDrawer extends DrawerProps {
    mettleUser: IMettleUser | null;
}

export const AddProductToUserDrawer: React.FC<AddProductToUserDrawer> = ({ mettleUser, ...props }) => {
    const { data } = useGetMettleProducts();

    const products = data?.data;

    const [selectedProductUuid, setSelectedProductUuid] = useState<string>();

    const { mutate: applyProduct, isPending } = useApplyProductToUser();

    const handleApplyProduct = () => {
        if (!selectedProductUuid || !mettleUser?.user_uid) return;
        applyProduct(
            {
                userUid: mettleUser?.user_uid,
                productUuid: selectedProductUuid,
            },
            {
                onSuccess: () => {
                    setSelectedProductUuid(undefined);
                    props.onClose?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
                },
            },
        );
    };

    return (
        <Drawer
            {...props}
            title="Adicionar produto ao usuário"
            footer={
                <Button
                    size="large"
                    block
                    style={{
                        justifySelf: 'flex-end',
                    }}
                    loading={isPending}
                    onClick={handleApplyProduct}
                    disabled={!selectedProductUuid}
                    type="primary"
                >
                    Adicionar
                </Button>
            }
            onClose={(e) => {
                setSelectedProductUuid(undefined);
                props.onClose?.(e);
            }}
        >
            <Flex vertical style={{ height: '100%' }} gap="1rem">
                <div>
                    <Text>Produtos aplicados ao usuário: </Text>
                    <Text strong>
                        {products
                            ?.filter((product) => mettleUser?.customClaims?.roles.includes(product.productId))
                            .map((product) => product.productName)
                            .join(', ')}
                    </Text>
                </div>

                <Text>Selecione um produto para aplicar à este aluno:</Text>
                <Select
                    placeholder="Selecione um produto disponível"
                    options={products?.map((product) => ({
                        label: `${product.productName}${
                            mettleUser?.customClaims?.roles.includes(product.productId) ? ' - já possui' : ''
                        }`,
                        value: product.productUuid,
                        disabled: mettleUser?.customClaims?.roles.includes(product.productId),
                    }))}
                    onChange={(value) => setSelectedProductUuid(value)}
                    maxLength={1}
                    maxTagCount={1}
                    value={selectedProductUuid}
                />
            </Flex>
        </Drawer>
    );
};
