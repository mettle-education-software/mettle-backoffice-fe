'use client';

import { Card, Col, Row } from 'antd';
import { Text, AppLayout } from 'components';
import { withAuthentication } from 'libs';
import React from 'react';

function Home() {
    return (
        <AppLayout>
            <Row>
                <Col span={24}>
                    <Row gutter={16}>
                        <Col>
                            <Card title={<Text level="h5">Quantidade de usuários na Mettle</Text>}>
                                <Text level="h1">100</Text>
                            </Card>
                        </Col>
                        <Col>
                            <Card title={<Text level="h5">Quantidade de empresas na Mettle</Text>}>
                                <Text level="h1">10</Text>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default withAuthentication(Home);
