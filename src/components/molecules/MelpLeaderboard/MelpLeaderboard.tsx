'use client';

import { TrophyOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Card, Col, Row, Spin, Space, Progress, Tooltip } from 'antd';
import { Text } from 'components';
import { useGetMelpLeaderboard } from 'hooks';
import React from 'react';

const LeaderboardCard = styled(Card)`
    max-height: calc(100vh - 10rem);
    height: calc(100vh - 10rem);
    overflow-y: auto;
`;

const LeaderTitle = styled(Row)`
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;

    &:hover {
        background-color: var(--secondary);
    }
`;

const PositionAvatar = styled(Avatar)`
    background: var(--secondary);
`;

export const MelpLeaderboard = () => {
    const { data: leaderboard, isLoading, isRefetching } = useGetMelpLeaderboard();

    return (
        <LeaderboardCard title={<Text level="h4">MELP Top Performers</Text>}>
            <Spin spinning={isLoading || isRefetching}>
                <Row gutter={[18, 18]}>
                    {leaderboard?.data?.map((item, position) => (
                        <Col span={24} key={item.uid}>
                            <LeaderTitle align="middle" justify="space-between" gutter={12}>
                                <Col>
                                    <Row gutter={18} align="middle">
                                        <Col>
                                            <PositionAvatar size={50} shape="square">
                                                <Text level="h2" size="2rem">
                                                    #{position + 1}
                                                </Text>
                                            </PositionAvatar>
                                        </Col>

                                        <Col>
                                            <Space direction="vertical">
                                                <Text level="span" fontWeight="400">
                                                    {item.email}
                                                </Text>
                                                <Text fontColor="neutral" level="span" size="0.9rem">
                                                    Dia na MELP: {item.currentMelpDay}
                                                </Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row gutter={18} align="middle">
                                        <Col>
                                            <Progress
                                                size={50}
                                                type="circle"
                                                showInfo
                                                percent={item.performanceOverall}
                                                format={() => item.performanceOverall.toFixed(0) + '%'}
                                            />
                                        </Col>

                                        <Col>
                                            <Tooltip title={`Score ${item.score.toFixed(3)}`}>
                                                <Progress
                                                    size={50}
                                                    type="circle"
                                                    showInfo
                                                    format={() => <TrophyOutlined />}
                                                    percent={(item.score / 13510.2511832) * 100}
                                                />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Col>
                            </LeaderTitle>
                        </Col>
                    ))}
                </Row>
            </Spin>
        </LeaderboardCard>
    );
};
