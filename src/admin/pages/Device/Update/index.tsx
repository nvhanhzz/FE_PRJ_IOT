import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDeviceById, updateDeviceById } from '../../../services/deviceService';
import OutletTemplate from '../../../templates/Outlet';
import { LoadingOutlined } from '@ant-design/icons';
import {Device} from "../Create";

const EditDevice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await getDeviceById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError')); // Display error message for fetch failure
                    return;
                }
                setDevice(result.data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                message.error(t('admin.message.fetchError')); // Show error message if data fetch fails
            }
        };

        fetchDevice();
    }, [id, t]);

    const handleUpdateDevice = async (values: Device) => {
        setLoading(true);
        try {
            const response = await updateDeviceById(id as string, values);
            if (response.ok) {
                message.success(t('admin.message.updateSuccess')); // Show success message
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.updateError')); // Show error message
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.updateError')); // Show error message if update fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/devices`, name: t('admin.device.title') },
                { path: ``, name: t('admin.device.update.title') },
            ]}
        >
            {!device ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <Form onFinish={handleUpdateDevice} layout="vertical" initialValues={device}>
                    <Form.Item
                        label={t('admin.device.name')}
                        name="name"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Common required field message
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.device.codeDevice')}
                        name="codeDevice"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Common required field message
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.device.location')}
                        name="location"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Common required field message
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('admin.device.update.updateDeviceButton')}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </OutletTemplate>
    );
};

export default EditDevice;