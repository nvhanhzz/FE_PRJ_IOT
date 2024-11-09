import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, DatePicker, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { postAccount } from "../../../services/accountService";
import { getRoles } from "../../../services/roleSevice.tsx";
import './CreateAccount.scss';
import {Role} from "../../Role";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface AccountFormValues {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    gender: string;
    address: string;
    dateOfBirth: string;
    password: string;
    role: string;
}

const CreateAccount: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
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
    }, []);

    const handleCreateAccount = async (values: AccountFormValues) => {
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

            const response = await postAccount(payload);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/accounts`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        form.resetFields();
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/accounts`, name: t('admin.account.title') },
                { path: ``, name: t('admin.account.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateAccount}
                layout="vertical"
                className="create-account-form"
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
                            rules={[{ required: true, message: t('admin.account.validation.password') }]}
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
                                onChange={(_date, dateString) => {
                                    form.setFieldsValue({ dateOfBirth: dateString });
                                }}
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
                                <Select.Option value="Male">{t('admin.account.gender.male')}</Select.Option>
                                <Select.Option value="Female">{t('admin.account.gender.female')}</Select.Option>
                                <Select.Option value="Other">{t('admin.account.gender.other')}</Select.Option>
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

export default CreateAccount;
