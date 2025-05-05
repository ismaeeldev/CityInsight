// assets
import { IconShield } from '@tabler/icons-react';  // Using a security-related icon

// constant
const icons = {
    IconShield
};

// ==============================|| PERMISSION MANAGEMENT MENU ITEMS ||============================== //

const permissionManagement = {
    id: 'permission-management',
    title: 'Manage Permissions',
    caption: '',
    icon: icons.IconShield,
    type: 'group',
    children: [
        {
            id: 'permissions',
            title: 'Permissions',
            type: 'collapse',
            icon: icons.IconShield,
            children: [
                {
                    id: 'all-roles',
                    title: 'All Roles',
                    type: 'item',
                    url: '/admin/all-permission',


                },
            ]
        }
    ]
};

export default permissionManagement;
