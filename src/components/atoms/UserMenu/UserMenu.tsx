'use client';

import styled from '@emotion/styled';
import { Avatar, Row, Col, Dropdown } from 'antd';
import { handleLogout } from 'libs';
import { useRouter } from 'next/navigation';
import { useAppContext } from 'providers';
import React from 'react';
import { Text } from '../Text/Text';

const WrapperRow = styled(Row)`
    min-width: 200px;
    cursor: pointer;
    margin-right: 0.5rem !important;
`;

export const UserMenu = () => {
    const { user } = useAppContext();
    const router = useRouter();

    return (
        <Dropdown
            menu={{
                items: [
                    {
                        key: 'profile',
                        label: 'Perfil',
                        onClick: () => router.push('/profile'),
                    },
                    {
                        key: 'logout',
                        label: 'Logout',
                        onClick: () => handleLogout(),
                    },
                ],
            }}
        >
            <WrapperRow gutter={16} align="middle" justify="end">
                <Col>
                    <Row justify="center">
                        <Avatar size="large" src={user?.profileImageSrc}>
                            {user?.name.split('')[0]}
                        </Avatar>
                    </Row>
                </Col>
                <Col>
                    <Text level="span" fontColor="primary">
                        {user?.name}
                    </Text>
                </Col>
            </WrapperRow>
        </Dropdown>
    );
};
