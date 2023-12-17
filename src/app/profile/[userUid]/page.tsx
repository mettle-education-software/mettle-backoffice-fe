'use client';

import { Col, Row, Spin } from 'antd';
import { AppLayout, ProfilePicture, Text } from 'components';
import { useGetUserProfile } from 'hooks';
import { withAuthentication } from 'libs';
import React from 'react';

function Profile({ userUid }: { userUid: string }) {
    const { data: profileData, isLoading } = useGetUserProfile(userUid);

    return (
        <AppLayout>
            <Spin spinning={isLoading}>
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
                                            {profileData?.userData?.firstName} {profileData?.userData?.lastName}
                                        </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </AppLayout>
    );
}

export default withAuthentication(Profile);
