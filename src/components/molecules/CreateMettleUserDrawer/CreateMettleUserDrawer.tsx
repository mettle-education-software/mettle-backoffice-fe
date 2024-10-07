import { Drawer, Form, Input, Select, DatePicker, Spin, Button } from 'antd';
import { useCreateMettleUser, useGetProductsShortList } from 'hooks';
import { ICreateMettleUserDTO } from 'interfaces';
import { useNotificationsContext } from 'providers';
import React from 'react';

interface CreateMettleUserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateMettleUserDrawer: React.FC<CreateMettleUserDrawerProps> = ({ isOpen, onClose }) => {
    const { data: productsShortList, isLoading } = useGetProductsShortList();
    const createMettleUser = useCreateMettleUser();
    const { showNotification } = useNotificationsContext();
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleCreateSubmission = (values: any) => {
        const payload: ICreateMettleUserDTO = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
            isFreemium: false,
        };

        createMettleUser.mutate(payload, {
            onSuccess: () => {
                handleClose();
                showNotification('success', 'Sucesso!', 'Usuário adicionado à Mettle');
            },
            onError: (error) => {
                handleClose();
                showNotification('error', 'Erro!', error.message || 'Algo deu errado. Usuário não foi criado.');
            },
        });
    };

    const requiredRule = { required: true, message: 'Campo obrigatório' };

    return (
        <Drawer title="Criar novo usuário na Mettle" onClose={handleClose} open={isOpen}>
            <Spin spinning={isLoading}>
                <Form layout="vertical" form={form} onFinish={handleCreateSubmission}>
                    <Form.Item name="firstName" label="Nome" rules={[requiredRule]}>
                        <Input placeholder="John" />
                    </Form.Item>
                    <Form.Item name="lastName" label="Sobrenome" rules={[requiredRule]}>
                        <Input placeholder="Armless" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[requiredRule, { type: 'email', message: 'Insira um email válido' }]}
                    >
                        <Input placeholder="john@mail.co" />
                    </Form.Item>
                    <Form.Item name="purchaseDate" label="Data da compra" rules={[requiredRule]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            onChange={(value) => console.log('value', value)}
                            allowClear
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current.toDate().getTime() > new Date().getTime()}
                        />
                    </Form.Item>
                    <Form.Item name="purchaseProductsIds" label="Planos aplicados" rules={[requiredRule]}>
                        <Select mode="multiple" placeholder="Selecione os produtos">
                            {productsShortList?.map((product) => (
                                <Select.Option key={product.productUuid} value={product.productUuid}>
                                    {product.productName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={createMettleUser.isPending}>
                        Adicionar usuário
                    </Button>
                </Form>
            </Spin>
        </Drawer>
    );
};
