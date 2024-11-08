import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserById, updateUserById } from '../../../services/userService';
import OutletTemplate from '../../../templates/Outlet';
import { LoadingOutlined } from '@ant-design/icons';

export interface User {
    username: string;
    className: string;
    email: string;
    gender: string;
    phone: string;
    rfidCode: string;
    studentCode: string;
}

const EditUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError'));
                    return;
                }
                setUser(result.data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                message.error(t('admin.message.fetchError'));
            }
        };

        fetchUser();
    }, [id, t]);

    const handleUpdateUser = async (values: User) => {
        setLoading(true);
        try {
            const response = await updateUserById(id as string, values);
            if (response.ok) {
                message.success(t('admin.message.updateSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.updateError'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.updateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/users`, name: t('admin.user.title') },
                { path: ``, name: t('admin.user.update.title') },
            ]}
        >
            {!user ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <Form onFinish={handleUpdateUser} layout="vertical" initialValues={user}>
                    <Form.Item
                        label={t('admin.user.rfidCode')}
                        name="rfidCode"
                    >
                        <Input disabled value={user?.rfidCode} /> {/* Display RFID Code as non-editable */}
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.username')}
                        name="username"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.className')}
                        name="className"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.email')}
                        name="email"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.gender.title')}
                        name="gender"
                    >
                        <Select>
                            <Select.Option value="Male">{t('admin.user.gender.male')}</Select.Option>
                            <Select.Option value="Female">{t('admin.user.gender.female')}</Select.Option>
                            <Select.Option value="Other">{t('admin.user.gender.other')}</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.phone')}
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.user.studentCode')}
                        name="studentCode"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('admin.user.update.updateButton')}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </OutletTemplate>
    );
};

export default EditUser;
