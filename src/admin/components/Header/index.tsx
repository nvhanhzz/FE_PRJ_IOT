import React, { useState } from 'react';
import { Button, Spin, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import { postLogout } from '../../services/authService';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { setCurrentAccount } from '../../redux/actions/account';
import { addAlert } from '../../redux/actions/alert';

interface HeaderProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, toggleCollapse }) => {
    const { t } = useTranslation();
    const dispatch = useAdminDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const response = await postLogout();
        if (response.ok) {
            dispatch(setCurrentAccount(null));
            dispatch(addAlert(t('admin.logout.successTitle'), t('admin.logout.successMessage'), 5));
        }
        setIsLoading(false);
    };

    return (
        <div className="app-header">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                className="collapse-button"
            />

            <Tooltip title={t('admin.header.logout')}>
                <span onClick={handleLogout} className="logout-icon">
                    {isLoading ? <Spin size="small" /> : <LogoutOutlined />}
                </span>
            </Tooltip>
        </div>
    );
};

export default AppHeader;