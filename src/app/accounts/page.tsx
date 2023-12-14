'use client';

import { Button, Card, Col, Row } from 'antd';
import { Text, AppLayout } from 'components';
import { withAuthentication } from 'libs';
import React from 'react';

function Home() {
    return (
        <AppLayout>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Text level="h3" fontWeight="500">
                                    Contas
                                </Text>
                            </Col>
                            <Col>
                                <Row gutter={16}>
                                    <Col>
                                        <Button type="primary">+ Mettle User</Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary">+ Mettle Admin</Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary">+ Mettle Company</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default withAuthentication(Home);
