'use client';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    FormOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Logo, UserMenu } from '../../atoms';

const { Header, Content, Sider } = Layout;

const AppHeader = styled(Header)`
    background: var(--tertiary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
`;

const LogoWrapper = styled.div`
    max-width: 6.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const Sidebar = styled(Sider)`
    width: 12rem;
    max-width: 20vw;
    max-height: 100%;
    height: 100%;
    min-height: 100%;
    background: var(--primary) !important;
    box-shadow: 0 2px 8px 0 #00000026;

    .trigger {
        background: var(--primary) !important;
        border-top: 1px solid var(--neutral) !important;
        color: var(--tertiary);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        padding-left: 1rem;
    }
`;

const PageLayout = styled(Layout)`
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 100vw;
`;

const ContentLayout = styled(Layout)`
    max-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
`;

const AppContent = styled(Content)`
    padding: 1.5rem;
    overflow-y: auto;
    background: var(--quinary);
`;

const CustomMenu = styled(Menu)`
    .ant-menu-item.ant-menu-item-selected {
        background: var(--quinary);
        color: var(--secondary);
        box-shadow: -3px 0 0 0 var(--secondary) inset;
        width: 100%;
        margin: 0;
    }

    .ant-menu-item,
    .ant-menu-item.ant-menu-item-selected {
        border-radius: 0;
        width: 100%;
        margin: 0;
    }
`;

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    return (
        <PageLayout>
            <AppHeader>
                <LogoWrapper
                    onClick={() => {
                        router.push('/home');
                    }}
                >
                    <Logo />
                </LogoWrapper>
                <UserMenu />
            </AppHeader>
            <ContentLayout>
                <Sidebar
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    trigger={<div className="trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>}
                >
                    <CustomMenu
                        mode="inline"
                        selectedKeys={pathname.split('/')}
                        items={[
                            {
                                key: 'home',
                                icon: <DashboardOutlined />,
                                label: 'Dashboard',
                                onClick: ({ domEvent }) => {
                                    domEvent.preventDefault();
                                    router.push('/home');
                                },
                            },
                            {
                                key: 'accounts',
                                icon: <FormOutlined />,
                                label: 'Contas',
                                onClick: ({ domEvent }) => {
                                    domEvent.preventDefault();
                                    router.push('/accounts');
                                },
                            },
                        ]}
                    />
                </Sidebar>
                <AppContent>{children}</AppContent>
            </ContentLayout>
        </PageLayout>
    );
};
