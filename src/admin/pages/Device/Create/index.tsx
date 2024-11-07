import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { postDevice } from '../../../services/deviceService'; // Adjusted import for device service
import OutletTemplate from '../../../templates/Outlet';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Device {
    name: string,
    location: string,
    codeDevice: string
}

const CreateDevice: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateDevice = async (values: Device) => {
        setLoading(true);
        try {
            const response = await postDevice(values); // Adjusted to call the device service
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            // Assume response status 201 means success
            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/devices`); // Adjust navigation to the device list page
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/devices`, name: t('admin.device.title') },
                { path: ``, name: t('admin.device.create.title') }, // Adjust breadcrumb title
            ]}
        >
            <Form onFinish={handleCreateDevice} layout="vertical">
                <Form.Item
                    label={t('admin.device.name')} // Adjusted translation key
                    name="name"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.device.location')} // Adjusted translation key
                    name="location"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.device.codeDevice')} // Adjusted translation key
                    name="codeDevice"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('admin.device.create.createDeviceButton')}
                    </Button>
                </Form.Item>
            </Form>
        </OutletTemplate>
    );
};

export default CreateDevice;