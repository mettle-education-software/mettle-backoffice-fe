import { Drawer, Form, Button, Row, Col, Input } from 'antd';
import { useCreateMettleProduct } from 'hooks';
import { CreateMettleProductDTO } from 'interfaces';
import { useNotificationsContext } from 'providers';
import { Rule } from 'rc-field-form/es/interface';
import React from 'react';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
}

export const CreateProductDrawer = ({ open, onClose }: DrawerProps) => {
    const { showNotification } = useNotificationsContext();
    const createMettleProduct = useCreateMettleProduct();
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleCreateProduct = (values: CreateMettleProductDTO) => {
        createMettleProduct.mutate(values, {
            onSuccess: () => {
                showNotification('success', 'Sucesso!', `${values.productName} criado com sucesso!`);
                handleClose();
            },
            onError: (error) => {
                showNotification('error', 'Algo deu errado', error.message || 'Não foi possível criar o produto.');
                handleClose();
            },
        });
    };

    const formRules = {
        productName: [
            { required: true, message: 'Por favor, digite o nome do produto!' },
            {
                max: 50,
                message: 'O nome do produto deve ter no máximo 30 caracteres.',
            },
        ],
        productDescription: [
            { required: true, message: 'Por favor, digite a descrição do produto!' },
            {
                max: 300,
                message: 'A descrição do produto deve ter no máximo 300 caracteres.',
            },
        ],
        checkoutUrl: [
            { required: true, message: 'Insira a url de checkout (carrinho ou pagina de vendas)!' },
            {
                type: 'url',
                message: 'Insira uma url válida!',
            },
        ],
    };

    return (
        <Drawer title="Criar novo produto" open={open} onClose={handleClose}>
            <Row>
                <Col span={24}>
                    <Form form={form} layout="vertical" size="large" onFinish={handleCreateProduct}>
                        <Form.Item name="productName" label="Nome do produto" rules={formRules.productName}>
                            <Input type="text" placeholder="Acesso total..." />
                        </Form.Item>
                        <Form.Item
                            name="productDescription"
                            label="Descrição do produto"
                            rules={formRules.productDescription}
                        >
                            <Input.TextArea placeholder="Acesso total ao programa de Inglês..." />
                        </Form.Item>
                        <Form.Item name="checkoutUrl" label="URL de checkout" rules={formRules.checkoutUrl as Rule[]}>
                            <Input type="text" placeholder="https://hotmart.com.br" style={{ width: '100%' }} />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block loading={createMettleProduct.isPending}>
                            Criar produto
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Drawer>
    );
};
