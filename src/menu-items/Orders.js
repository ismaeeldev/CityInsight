// assets
// import { IconKey } from '@tabler/icons-react';
import { IconAdCircle } from '@tabler/icons-react';  // Changed to an order-related icon

// constant
const icons = {
    IconAdCircle
};

// ==============================|| ORDER MANAGEMENT MENU ITEMS ||============================== //

const orderManagement = {
    id: 'marketing-management',
    title: 'Manage Marketing',
    caption: '',
    icon: icons.IconAdCircle,
    type: 'group',
    children: [
        {
            id: 'ads',
            title: 'Ads',
            type: 'collapse',
            icon: icons.IconAdCircle,
            children: [
                {
                    id: 'Create Ads',
                    title: 'Create Ads',
                    type: 'item',
                    url: '/admin/create-ads',
                },
                {
                    id: 'Ads Catalog',
                    title: 'Ads Catalog',
                    type: 'item',
                    url: '/admin/ad-catalog',
                },

            ]
        },

    ]
};

export default orderManagement;
