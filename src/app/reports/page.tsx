'use client';

import { DownloadOutlined, InfoCircleOutlined, InfoOutlined, ReloadOutlined } from '@ant-design/icons';
import { Info } from '@mui/icons-material';
import { Button, Card, Col, DatePicker, Divider, Form, Row, Select, Space, Spin, Tooltip } from 'antd';
import { AppLayout } from 'components';
import type { Dayjs } from 'dayjs';
import { useDownloadUsersCSV, useGetProductsShortList } from 'hooks';
import { QueryParams } from 'interfaces';
import { withAuthentication } from 'libs';
import React from 'react';

const { RangePicker } = DatePicker;

const accountStatusOptions = [
    { label: 'Ativa', value: 'ACTIVE' },
    { label: 'Arquivada', value: 'ARCHIVED' },
    // { label: 'Inativa', value: 'INACTIVE' },
    // { label: 'Pendente', value: 'PENDING' },
];

const melpStatusOptions = [
    { label: 'Início do IMERSO', value: 'MELP_BEGIN' },
    { label: 'DEDA pode começar', value: 'CAN_START_DEDA' },
    { label: 'DEDA aguardando início', value: 'DEDA_STARTED_NOT_BEGUN' },
    { label: 'DEDA iniciado', value: 'DEDA_STARTED' },
    { label: 'DEDA pausado', value: 'DEDA_PAUSED' },
    { label: 'DEDA finalizado', value: 'DEDA_FINISHED' },
    { label: 'MELP suspenso', value: 'MELP_SUSPENDED' },
];

const orderByFieldOptions = [
    { label: 'Data de criação de usuário', value: 'created_at' },
    { label: 'Email', value: 'email' },
    { label: 'Nome', value: 'first_name' },
    { label: 'Sobrenmoe', value: 'last_name' },
    { label: 'Overall performance', value: 'overall_performance' },
    { label: 'Status da conta', value: 'user_status' },
];

type ReportFiltersFormValues = {
    accountCreatedRange?: [Dayjs, Dayjs];
    accountStatusIn?: string[];
    accountStatusNotIn?: string[];
    melpStartDateRange?: [Dayjs, Dayjs];
    melpStatusIn?: string[];
    melpStatusNotIn?: string[];
    orderByDirection?: 'ASC' | 'DESC';
    orderByField?: string;
    purchasedProducts?: string[];
    searchQuery?: string;
};

function Reports() {
    const [form] = Form.useForm<ReportFiltersFormValues>();
    const formValues = Form.useWatch([], form);

    const downloadUsersCSV = useDownloadUsersCSV();
    const { data: productsShortList, isLoading: isProductsShortListLoading } = useGetProductsShortList();

    const hasSelectedFilters = React.useMemo(() => {
        if (!formValues) return false;

        return !!(
            formValues.searchQuery?.trim() ||
            formValues.orderByField ||
            formValues.accountStatusIn?.length ||
            formValues.accountStatusNotIn?.length ||
            formValues.melpStatusIn?.length ||
            formValues.melpStatusNotIn?.length ||
            formValues.purchasedProducts?.length ||
            formValues.melpStartDateRange?.length ||
            formValues.accountCreatedRange?.length
        );
    }, [formValues]);

    const buildReportParams = (values: ReportFiltersFormValues): QueryParams => {
        const params: QueryParams = {};
        const searchQuery = values.searchQuery?.trim();

        if (searchQuery) params.searchQuery = searchQuery;
        if (values.orderByField && values.orderByDirection)
            params.orderBy = `${values.orderByField}.${values.orderByDirection}`;
        if (values.accountStatusIn?.length) params.accountStatusIn = values.accountStatusIn.join(',');
        if (values.accountStatusNotIn?.length) params.accountStatusNotIn = values.accountStatusNotIn.join(',');
        if (values.melpStatusIn?.length) params.melpStatusIn = values.melpStatusIn.join(',');
        if (values.melpStatusNotIn?.length) params.melpStatusNotIn = values.melpStatusNotIn.join(',');
        if (values.purchasedProducts?.length) params.purchasedProducts = values.purchasedProducts.join(',');
        if (values.melpStartDateRange?.[0])
            params.melpStartDateFrom = values.melpStartDateRange[0].format('YYYY-MM-DD');
        if (values.melpStartDateRange?.[1]) params.melpStartDateTo = values.melpStartDateRange[1].format('YYYY-MM-DD');
        if (values.accountCreatedRange?.[0])
            params.accountCreatedFrom = values.accountCreatedRange[0].format('YYYY-MM-DD');
        if (values.accountCreatedRange?.[1])
            params.accountCreatedTo = values.accountCreatedRange[1].format('YYYY-MM-DD');

        return params;
    };

    const handleDownloadReport = (values: ReportFiltersFormValues) => {
        downloadUsersCSV.mutate(buildReportParams(values));
    };

    return (
        <AppLayout>
            <Spin spinning={isProductsShortListLoading}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title="Relatório de usuários">
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={{ orderByDirection: 'DESC' }}
                                onFinish={handleDownloadReport}
                            >
                                <Row gutter={[16, 8]} align="bottom">
                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="purchasedProducts" label="Produtos aplicados à conta">
                                            <Select
                                                allowClear
                                                mode="multiple"
                                                placeholder="Select products"
                                                options={productsShortList?.map((product) => ({
                                                    label: product.productName,
                                                    value: product.productId,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="accountStatusIn" label="Inlcuir status da conta">
                                            <Select
                                                allowClear
                                                mode="tags"
                                                placeholder="Status"
                                                options={accountStatusOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="accountStatusNotIn" label="Excluir status da conta">
                                            <Select
                                                allowClear
                                                mode="tags"
                                                placeholder="Status"
                                                options={accountStatusOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={4}>
                                        <Form.Item label="Ordenar por">
                                            <Space.Compact block>
                                                <Form.Item name="orderByField" noStyle>
                                                    <Select
                                                        allowClear
                                                        placeholder="Campo"
                                                        options={orderByFieldOptions}
                                                    />
                                                </Form.Item>
                                                <Form.Item name="orderByDirection" noStyle>
                                                    <Select
                                                        style={{ width: 105 }}
                                                        options={[
                                                            { label: 'Descendente', value: 'DESC' },
                                                            { label: 'Ascendente', value: 'ASC' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Space.Compact>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 8]} align="bottom">
                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="melpStatusIn" label="Incluir status do IMERSO">
                                            <Select
                                                allowClear
                                                mode="multiple"
                                                placeholder="Status"
                                                options={melpStatusOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="melpStatusNotIn" label="Excluir status do IMERSO">
                                            <Select
                                                allowClear
                                                mode="multiple"
                                                placeholder="Status"
                                                options={melpStatusOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item
                                            name="melpStartDateRange"
                                            label={
                                                <>
                                                    IMERSO adicionado entre
                                                    <Tooltip title="Essa data se refere a quando o IMERSO foi comprado pelo usuário. Pode coincidir com a data de criação da conta de usuário ou não.">
                                                        <InfoCircleOutlined style={{ marginLeft: '1rem' }} />
                                                    </Tooltip>
                                                </>
                                            }
                                        >
                                            <RangePicker allowClear format="DD/MM/YYYY" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8} xl={5}>
                                        <Form.Item name="accountCreatedRange" label="Conta criada entre">
                                            <RangePicker allowClear format="DD/MM/YYYY" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={24} lg={8} xl={4}>
                                        <Form.Item>
                                            <Row justify="end" gutter={[8, 8]}>
                                                <Col>
                                                    <Button
                                                        icon={<ReloadOutlined />}
                                                        onClick={() => form.resetFields()}
                                                    >
                                                        Clear
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        disabled={!hasSelectedFilters}
                                                        htmlType="submit"
                                                        icon={<DownloadOutlined />}
                                                        loading={downloadUsersCSV.isPending}
                                                        type="primary"
                                                    >
                                                        Download report
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Divider style={{ margin: '8px 0 0' }} />
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </AppLayout>
    );
}

export default withAuthentication(Reports);
