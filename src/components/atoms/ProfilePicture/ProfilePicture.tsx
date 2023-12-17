'use client';

import styled from '@emotion/styled';
import { Avatar, Spin } from 'antd';
import { Text } from 'components';
// import { useUpdateAdminProfilePhoto } from 'hooks';
import { useAppContext } from 'providers';
import React, { useRef } from 'react';

const ProfileAvatar = styled(Avatar)`
    position: relative;

    &.no-picture,
    &.with-picture {
        cursor: pointer;
        transition: opacity 0.2s ease-in-out;
    }

    &.no-picture:hover,
    &.with-picture:hover {
        opacity: 0.8;
    }

    &.with-picture:hover::after {
        content: 'Alterar foto de perfil';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        z-index: 1;
    }
`;

export const ProfilePicture = () => {
    const { user } = useAppContext();
    // const uploadProfileImage = useUpdateAdminProfilePhoto();

    const handleProfileImageUpload = (profileImage?: File) => {
        const form = new FormData();

        if (profileImage) {
            form.append('profileImage', profileImage);

            // uploadProfileImage.mutate(
            //     {
            //         businessUuid: user?.businessUuid as string,
            //         adminUid: user?.uid as string,
            //         data: form,
            //     },
            //     {
            //         onSuccess: async () => {
            //             window.location.reload();
            //         },
            //     },
            // );
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <React.Fragment>
            <Spin spinning={false}>
                <ProfileAvatar
                    className={user?.profileImageSrc ? 'with-picture' : 'no-picture'}
                    size={250}
                    src={user?.profileImageSrc}
                    onClick={() => {
                        inputRef.current?.click();
                    }}
                >
                    <Text level="span" size="3rem">
                        {user?.name?.[0]}
                    </Text>
                </ProfileAvatar>
            </Spin>
            <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    handleProfileImageUpload(e.target.files?.[0]);
                }}
            />
        </React.Fragment>
    );
};
