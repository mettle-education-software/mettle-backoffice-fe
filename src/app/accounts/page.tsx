'use client';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { Text, AppLayout, MettleUsersTable, CreateMettleUserDrawer } from 'components';
import { withAuthentication } from 'libs';
import React, { useState } from 'react';

function Accounts() {
    const [isCreateMettleUserDrawerOpen, setIsCreateMettleUserDrawerOpen] = useState(false);

    return (
        <AppLayout>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Text level="h3">Contas Mettle</Text>
                            </Col>
                            <Col>
                                <Row gutter={16}>
                                    <Col>
                                        <Button type="primary" onClick={() => setIsCreateMettleUserDrawerOpen(true)}>
                                            + Mettle Usuário
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" disabled>
                                            + Mettle Empresa
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" disabled>
                                            + Mettle Admin
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Tabs
                        defaultActiveKey="mettleUsers"
                        items={[
                            {
                                key: 'mettleUsers',
                                label: 'Mettle Usuários',
                                children: <MettleUsersTable />,
                            },
                            {
                                key: 'mettleCompanies',
                                label: 'Mettle Empresas',
                                children: <div>Empresas</div>,
                                disabled: true,
                            },
                            {
                                key: 'mettleAdmins',
                                label: 'Mettle Admins',
                                children: <div>Admins</div>,
                                disabled: true,
                            },
                        ]}
                    />
                </Col>
            </Row>
            <CreateMettleUserDrawer
                isOpen={isCreateMettleUserDrawerOpen}
                onClose={() => setIsCreateMettleUserDrawerOpen(false)}
            />
        </AppLayout>
    );
}

export default withAuthentication(Accounts);
