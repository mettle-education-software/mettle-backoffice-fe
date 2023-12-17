import { MoreOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';

const IconWrapper = styled.div`
    border-radius: 25%;
    font-size: 1rem !important;
    width: 2rem;
    aspect-ratio: 1;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;

    &:hover {
        background: var(--neutral);
    }
`;

export const ActionsDropdown = ({ className, items }: { items: MenuProps['items']; className?: string }) => {
    return (
        <Dropdown className={className} menu={{ items }} trigger={['click']}>
            <IconWrapper>
                <MoreOutlined className="icon" />
            </IconWrapper>
        </Dropdown>
    );
};
