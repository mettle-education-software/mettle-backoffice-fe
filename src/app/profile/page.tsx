'use client';

import { CheckOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Spin, Modal } from 'antd';
import { AxiosError } from 'axios';
import { AppLayout, ProfilePicture, Text } from 'components';
import { useGetUserDetails, useUpdateUserEmail, useUpdateUserPassword } from 'hooks';
import { withAuthentication } from 'libs';
import { useAppContext } from 'providers';
import React from 'react';

function Profile() {
    const { user } = useAppContext();

    const { data: userDetails, isLoading: isUserDetailsLoading, isPending } = useGetUserDetails(user?.uid as string);
    const updateUserPassword = useUpdateUserPassword();
    const updateUserEmail = useUpdateUserEmail();

    const [isEditEmail, setIsEditEmail] = React.useState(false);
    const [isEditPassword, setIsEditPassword] = React.useState(false);

    const [emailForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const handleUpdateEmail = ({ email }: { email: string }) => {
        updateUserEmail.mutate(
            {
                userUid: user?.uid as string,
                data: { email },
            },
            {
                onSuccess: async () => {
                    setIsEditEmail(false);
                    Modal.success({
                        title: 'E-mail atualizado com sucesso',
                        content: 'Por favor, faça login novamente com o novo e-mail para continuar',
                        okText: 'Ok',
                        onOk: () => {
                            window.location.reload();
                        },
                    });
                },
                onError: async (error) => {
                    emailForm.setFields([
                        {
                            name: 'email',
                            errors: [error.message],
                        },
                    ]);
                },
            },
        );
    };

    const handleUpdatePassword = ({ password }: { password: string }) => {
        updateUserPassword.mutate(
            {
                userUid: user?.uid as string,
                data: { password },
            },
            {
                onSuccess: async () => {
                    setIsEditPassword(false);
                    Modal.success({
                        title: 'Senha atualizada com sucesso',
                        content: 'Por favor, faça login novamente com a nova senha para continuar',
                        okText: 'Ok',
                        onOk: () => {
                            window.location.reload();
                        },
                    });
                },
                onError: async (error: AxiosError) => {
                    passwordForm.setFields([
                        {
                            name: 'password',
                            errors: [
                                JSON.stringify(error?.response?.data) ||
                                    'Senha inválida. Tente novamente com uma senha diferente.',
                            ],
                        },
                    ]);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Spin
                spinning={
                    isUserDetailsLoading || isPending || updateUserEmail.isPending || updateUserPassword.isPending
                }
            >
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
                                            {userDetails?.userData.firstName} {userDetails?.userData.lastName}
                                        </Text>
                                    </Col>
                                    <Col span={24}>
                                        <Form form={emailForm} onFinish={handleUpdateEmail}>
                                            <Row gutter={12} justify="start" align="top">
                                                <Col>
                                                    <UserOutlined />
                                                </Col>
                                                <Col>
                                                    {isEditEmail ? (
                                                        <Form.Item
                                                            name="email"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'E-mail é obrigatório',
                                                                },
                                                                { type: 'email', message: 'Insira um email válido' },
                                                            ]}
                                                        >
                                                            <Input placeholder="E-mail" type="email" />
                                                        </Form.Item>
                                                    ) : (
                                                        <Text level="h3" fontWeight="400">
                                                            {userDetails?.userData.email}
                                                        </Text>
                                                    )}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        type="default"
                                                        shape="round"
                                                        icon={<EditOutlined />}
                                                        onClick={() => setIsEditEmail(!isEditEmail)}
                                                    />
                                                </Col>
                                                {isEditEmail && (
                                                    <Col>
                                                        <Button
                                                            color="success"
                                                            type="default"
                                                            shape="round"
                                                            icon={<CheckOutlined />}
                                                            htmlType="submit"
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form>
                                    </Col>

                                    <Col span={24}>
                                        <Form form={passwordForm} onFinish={handleUpdatePassword}>
                                            <Row gutter={12} justify="start" align="top">
                                                <Col>
                                                    <LockOutlined />
                                                </Col>
                                                <Col>
                                                    {isEditPassword ? (
                                                        <Form.Item
                                                            name="password"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Insira uma senha',
                                                                },
                                                                {
                                                                    min: 8,
                                                                    message:
                                                                        'A senha precisa ter no mínimo 8 caracteres',
                                                                },
                                                            ]}
                                                        >
                                                            <Input.Password placeholder="Senha" />
                                                        </Form.Item>
                                                    ) : (
                                                        <Text level="h3" fontWeight="400">
                                                            ****************************
                                                        </Text>
                                                    )}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        type="default"
                                                        shape="round"
                                                        icon={<EditOutlined />}
                                                        onClick={() => setIsEditPassword(!isEditPassword)}
                                                    />
                                                </Col>
                                                {isEditPassword && (
                                                    <Col>
                                                        <Button
                                                            color="success"
                                                            type="default"
                                                            shape="round"
                                                            icon={<CheckOutlined />}
                                                            htmlType="submit"
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form>
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
