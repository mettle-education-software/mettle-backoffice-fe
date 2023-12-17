'use client';

import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Input, Form, Button, Row, Col, Spin } from 'antd';
import { Logo, Text } from 'components';
import { withoutAuthentication, handleLogin } from 'libs';
import Link from 'next/link';
import React from 'react';

const PageContainer = styled.div`
    max-height: 100vh;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
`;

const LogoContainer = styled.div`
    width: 50%;
    height: 100%;
    background-color: var(--tertiary);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const LogoWrapper = styled.div`
    width: 100%;
    max-width: 50%;
`;

const LoginContainer = styled.div`
    width: 50%;
    height: 100%;
    background-color: var(--quinary);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormContainer = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .input {
        border: 1pz solid var(--neutral);
        border-radius: 0;
        padding: 1rem;
        margin: 0;
    }

    .prefix-icon {
        color: var(--secondary);
    }

    .forgot-col {
        align-items: flex-end !important;
        display: flex;
        flex-direction: column;
        margin-bottom: 1.25rem;
    }
`;

const FormHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--secondary);
    padding: 1rem;
    margin-bottom: 1rem;
    color: var(--secondary);
`;

const LoginButton = styled(Button)`
    width: 100%;
    min-height: 40px;
`;

const ForgotPasswordLink = styled(Link)`
    color: var(--secondary);
    text-align: right;
    font-size: 1.2rem;

    &:hover {
        color: var(--tertiary);
    }
`;

const ErrorMessage = styled.span`
    color: red;
`;

function Login() {
    const [loginError, setLoginError] = React.useState<null | string>(null);
    const [isSignInLoading, setIsSignInLoading] = React.useState<boolean>(false);

    return (
        <PageContainer>
            <LogoContainer>
                <LogoWrapper>
                    <Logo />
                </LogoWrapper>
                <Text level="h1" fontWeight="500" size="2rem" fontColor="secondary">
                    Backoffice
                </Text>
            </LogoContainer>
            <LoginContainer>
                <FormContainer>
                    <Spin spinning={isSignInLoading}>
                        <FormHeader>
                            <span>Acesso | Mettle Business Manager</span>
                        </FormHeader>
                        <Form
                            layout="vertical"
                            onFinish={(values) => {
                                setIsSignInLoading(true);
                                handleLogin({
                                    email: values.email,
                                    password: values.password,
                                    setLoginErrorMessage: setLoginError,
                                    setIsSignInLoading,
                                });
                            }}
                        >
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Por favor insira o seu e-mail de login' }]}
                            >
                                <Input
                                    className="input"
                                    size="large"
                                    type="email"
                                    placeholder="exemplo@empresa.com.br"
                                    prefix={<UserOutlined className="prefix-icon" />}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Por favor insira a senha' }]}
                            >
                                <Input.Password
                                    className="input"
                                    size="large"
                                    placeholder="Senha"
                                    prefix={<LockOutlined className="prefix-icon" />}
                                />
                            </Form.Item>
                            <Row justify="end" align="middle">
                                <Col className="forgot-col" span={12}>
                                    <ForgotPasswordLink href={'/forgot-password'}>Esqueceu a senha?</ForgotPasswordLink>
                                </Col>
                            </Row>
                            <LoginButton loading={isSignInLoading} size="large" type="primary" htmlType="submit">
                                Entrar
                            </LoginButton>
                            {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
                        </Form>
                    </Spin>
                </FormContainer>
            </LoginContainer>
        </PageContainer>
    );
}

export default withoutAuthentication(Login);
