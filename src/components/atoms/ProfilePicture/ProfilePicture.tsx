'use client';

import { DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Spin, Button } from 'antd';
import { Text } from 'components';
import { useDeleteProfilePhoto, useUpdateProfilePhoto } from 'hooks';
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

const DeleteBadgeWrapper = styled.div`
    position: relative;

    .delete-profile-btn {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
`;

export const ProfilePicture = ({ src }: { src?: string | null }) => {
    const { user } = useAppContext();
    const uploadProfileImage = useUpdateProfilePhoto();
    const deleteProfileImage = useDeleteProfilePhoto();

    const handleProfileImageUpload = (profileImage?: File) => {
        const form = new FormData();

        if (profileImage) {
            form.append('profileImage', profileImage);

            uploadProfileImage.mutate(
                {
                    userUid: user?.uid as string,
                    data: form,
                },
                {
                    onSuccess: async () => {
                        window.location.reload();
                    },
                },
            );
        }
    };

    const handleProfileImageDelete = () => {
        deleteProfileImage.mutate(user?.uid as string, {
            onSuccess: async () => {
                window.location.reload();
            },
        });
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <React.Fragment>
            <Spin spinning={uploadProfileImage.isPending || deleteProfileImage.isPending}>
                <DeleteBadgeWrapper>
                    {src === undefined && user?.profileImageSrc && (
                        <Button
                            className="delete-profile-btn"
                            shape="circle"
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleProfileImageDelete}
                        />
                    )}
                    <ProfileAvatar
                        className={src === undefined && user?.profileImageSrc ? 'with-picture' : 'no-picture'}
                        size={250}
                        src={src === undefined ? user?.profileImageSrc : src}
                        onClick={() => {
                            inputRef.current?.click();
                        }}
                    >
                        {src === undefined && <Text level="span">Adicionar foto de perfil</Text>}
                        {src !== undefined && <Text level="span">Perfil</Text>}
                    </ProfileAvatar>
                </DeleteBadgeWrapper>
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
