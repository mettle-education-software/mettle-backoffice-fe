import { Drawer, Form, Button, Row, Col, Input, InputNumber } from 'antd';
import { useCreateMettleProduct } from 'hooks';
import { IProductDTO } from 'interfaces';
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

    const handleCreateProduct = (values: IProductDTO) => {
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
        productPrice: [
            { required: true, message: 'Por favor, digite o preço do produto!' },
            {
                type: 'number',
                min: 1,
                message: 'O preço do produto deve ser maior que 0.',
            },
        ],
    };

    return (
        <Drawer title="Criar novo produto" open={open} onClose={handleClose}>
            <Row>
                <Col span={24}>
                    <Form layout="vertical" size="large" onFinish={handleCreateProduct}>
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
                        <Form.Item name="productPrice" label="Preço" rules={formRules.productPrice as Rule[]}>
                            <InputNumber placeholder="199.99" style={{ width: '100%' }} prefix="R$" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Criar produto
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Drawer>
    );
};
