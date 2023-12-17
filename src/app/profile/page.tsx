'use client';

import { Col, Row } from 'antd';
import { AppLayout, ProfilePicture, Text } from 'components';
import { withAuthentication } from 'libs';
import { useAppContext } from 'providers';
import React from 'react';

function Profile() {
    const { user } = useAppContext();

    return (
        <AppLayout>
            <Row gutter={[24, 16]}>
                <Col span={24}>
                    <Row gutter={24} justify="start" align="top">
                        <Col>
                            <ProfilePicture />
                        </Col>
                        <Col>
                            <Row gutter={[24, 12]}>
                                <Col span={24}>
                                    <Text level="h1" fontWeight="600" size="3rem">
                                        {user?.name}
                                    </Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default withAuthentication(Profile);
