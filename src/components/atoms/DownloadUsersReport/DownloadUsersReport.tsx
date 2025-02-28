import { Download } from '@mui/icons-material';
import { Button, Flex } from 'antd';
import { useDownloadUsersCSV } from 'hooks';
import React from 'react';

export const DownloadUsersReport: React.FC = () => {
    const { mutate: downloadList, isPending } = useDownloadUsersCSV();

    const handleDownload = () => {
        downloadList();
    };

    return (
        <Button disabled onClick={handleDownload} loading={isPending} type="primary">
            <Flex align="center" gap={8}>
                <Download style={{ fontSize: 16 }} />
                <span>Download users list</span>
            </Flex>
        </Button>
    );
};
