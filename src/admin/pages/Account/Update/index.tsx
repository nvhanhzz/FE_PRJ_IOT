import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, DatePicker, Select, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { getAccountById, updateAccountById } from "../../../services/accountService";
import { getRoles } from "../../../services/roleSevice.tsx";
import './UpdateAccount.scss';
import { Role } from "../../Role";
import { AccountFormValues } from "../Create";
import { Account } from "../index.tsx";
import dayjs from 'dayjs';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateAccount: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [form] = Form.useForm();
    const { t } = useTranslation();

    // Fetch dữ liệu tài khoản và roles
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await getAccountById(id as string);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data: Account = result.data;
                    form.setFieldsValue({
                        fullName: data.fullName,
                        email: data.email,
                        username: data.username,
                        phone: data.phone,
                        gender: data.gender,
                        role: data.role,
                        dateOfBirth: data.dateOfBirth,
                        datePicker: data.dateOfBirth ? dayjs(data.dateOfBirth) : null, // Chuyển thành đối tượng dayjs nếu có
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                message.error('Error fetching account data');
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await getRoles(1, 999999999);
                const data = await response.json();
                if (response.ok) {
                    setRoles(data.data.content);
                } else {
                    message.error('Failed to load roles');
                }
            } catch (error) {
                message.error('Error fetching roles');
                console.error(error);
            }
        };

        fetchRoles();
        fetchAccount();
    }, [id, form]);

    // Hàm xử lý khi cập nhật tài khoản
    const handleUpdateAccount = async (values: AccountFormValues) => {
        setLoading(true);
        try {
            const payload = {
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                phone: values.phone,
                gender: values.gender,
                address: values.address,
                dateOfBirth: values.dateOfBirth,
                password: values.password,
                role: values.role
            };

            const response = await updateAccountById(id as string, payload);
            const result = await response.json();
            if (!response.ok || result.status !== 200) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi reset form
    const handleResetForm = () => {
        form.resetFields();
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/accounts`, name: t('admin.account.title') },
                { path: ``, name: t('admin.account.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateAccount}
                layout="vertical"
                className="update-account-form"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.account.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.email')}
                            name="email"
                            rules={[{ required: true, message: t('admin.account.validation.email') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.username')}
                            name="username"
                            rules={[{ required: true, message: t('admin.account.validation.username') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.phone')}
                            name="phone"
                            rules={[{ required: true, message: t('admin.account.validation.phone') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.password')}
                            name="password"
                            rules={[{ message: t('admin.account.validation.password') }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.dateOfBirth')}
                            name="datePicker"
                            rules={[{ required: true, message: t('admin.account.validation.dateOfBirth') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                        <Form.Item name="dateOfBirth" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.account.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.account.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.account.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.account.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.account.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.account.role.title')}
                            name="role"
                            rules={[{ required: true, message: t('admin.account.validation.role') }]}
                        >
                            <Select placeholder={t('admin.account.role.placeholder')}>
                                {roles.map((role: Role) => (
                                    <Select.Option key={role.id} value={role.name}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}
                        className="reset-button"
                    >
                        {t('admin.form.reset')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="submit-button"
                    >
                        {t('admin.form.submit')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateAccount;