'use client';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Spin, Modal } from 'antd';
import { Text, AppLayout, CreateProductDrawer } from 'components';
import { useDeleteMettleProduct, useGetBackofficeDashboard, useGetMettleProducts } from 'hooks';
import { IProduct } from 'interfaces';
import { withAuthentication } from 'libs';
import { useNotificationsContext } from 'providers';
import React, { useState } from 'react';

const ProductCard = ({
    uuid,
    productTitle,
    productDescription,
    productPrice,
}: {
    uuid: IProduct['productUuid'];
    productTitle: IProduct['productName'];
    productDescription: IProduct['productDescription'];
    productPrice: IProduct['productPrice'];
}) => {
    const deleteProduct = useDeleteMettleProduct();
    const { showNotification } = useNotificationsContext();

    const handleDeleteProduct = () => {
        deleteProduct.mutate(uuid, {
            onSuccess: () => {
                showNotification('success', 'Sucesso', 'Produto removido com sucesso');
            },
            onError: () => {
                showNotification('error', 'Algo deu errado', 'Não foi possível remover o produto');
            },
        });
    };

    const handleModal = () => {
        Modal.confirm({
            title: 'Remover produto',
            content: 'Você tem certeza que deseja remover este produto?',
            okText: 'Sim',
            okButtonProps: {
                danger: true,
                loading: deleteProduct.isPending,
            },
            cancelText: 'Não',
            onOk: handleDeleteProduct,
        });
    };

    const cardActions = () => (
        <Row gutter={12}>
            <Col>
                <Button type="default" shape="default" onClick={handleModal} icon={<DeleteOutlined />} />
            </Col>
        </Row>
    );

    return (
        <Card title={<Text level="h4">{productTitle}</Text>} extra={cardActions()}>
            <Row gutter={[18, 24]}>
                <Col span={24}>
                    <Text level="p">{productDescription}</Text>
                </Col>
                <Col span={24}>
                    <Text level="h1" size="3rem">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(productPrice)}
                    </Text>
                </Col>
            </Row>
        </Card>
    );
};

function Home() {
    const { data: dashboardData, isLoading: isBackofficeDataLoading } = useGetBackofficeDashboard();
    const { data: mettleProducts, isLoading: isMettleProductsLoading } = useGetMettleProducts();

    const [isCreateProductDrawerOpen, setIsCreateProductDrawerOpen] = useState(false);

    return (
        <AppLayout>
            <Spin spinning={isBackofficeDataLoading || isMettleProductsLoading}>
                <Row gutter={[18, 24]}>
                    <Col span={24}>
                        <Text level="h2" fontWeight="400">
                            Usuários
                        </Text>
                    </Col>
                    <Col span={24}>
                        <Row gutter={16}>
                            <Col>
                                <Card title={<Text level="h4">Usuários na Mettle</Text>}>
                                    <Text level="h1">{dashboardData?.usersCount}</Text>
                                </Card>
                            </Col>
                            <Col>
                                <Card title={<Text level="h4">Empresas na Mettle</Text>}>
                                    <Text level="h1">{dashboardData?.businessCount}</Text>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <Row justify="start" align="middle" gutter={24}>
                            <Col>
                                <Text level="h2" fontWeight="400">
                                    Produtos
                                </Text>
                            </Col>
                            <Col>
                                <Button
                                    type="default"
                                    shape="default"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsCreateProductDrawerOpen(true)}
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <Row gutter={[18, 18]}>
                            {mettleProducts?.data?.map((product) => (
                                <Col key={product.productUuid} span={8}>
                                    <ProductCard
                                        uuid={product.productUuid}
                                        productTitle={product.productName}
                                        productDescription={product.productDescription}
                                        productPrice={product.productPrice}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Spin>
            <CreateProductDrawer open={isCreateProductDrawerOpen} onClose={() => setIsCreateProductDrawerOpen(false)} />
        </AppLayout>
    );
}

export default withAuthentication(Home);
