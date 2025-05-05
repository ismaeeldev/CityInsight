// assets
import { IconUsers } from '@tabler/icons-react';

// constant
const icons = {
    IconUsers
};

// ==============================|| USER INFO MENU ITEMS ||============================== //

const userInfo = {
    id: 'user-info',
    title: 'User Information',
    caption: '',
    icon: icons.IconUsers,
    type: 'group',
    children: [
        {
            id: 'User',
            title: 'User',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'all-user',
                    title: 'All User',
                    type: 'item',
                    url: '/admin/all-user',
                },

                {
                    id: 'role-requests',
                    title: 'Role Requests',
                    type: 'item',
                    url: '/admin/role-requests',
                }


            ]
        }
    ]
};

export default userInfo;
