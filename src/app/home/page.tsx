'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { Text, AppLayout, CreateProductDrawer, MettleProductsTable } from 'components';
import { withAuthentication } from 'libs';
import React, { useState } from 'react';

function Home() {
    const [isCreateProductDrawerOpen, setIsCreateProductDrawerOpen] = useState(false);

    return (
        <AppLayout>
            <Row gutter={[18, 24]} align="stretch">
                <Col span={24}>
                    <Row gutter={[18, 24]}>
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
                                <MettleProductsTable />
                            </Row>
                        </Col>
                    </Row>
                </Col>

                {/*<Col span={8}>/!*<MelpLeaderboard />*!/</Col>*/}
            </Row>
            <CreateProductDrawer open={isCreateProductDrawerOpen} onClose={() => setIsCreateProductDrawerOpen(false)} />
        </AppLayout>
    );
}

export default withAuthentication(Home);
