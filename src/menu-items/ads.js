// assets
import { IconAdCircle } from '@tabler/icons-react';  // Using the correct order-related icon

// constants
const icons = {
    IconAdCircle,
};

// ==============================|| ADS MANAGEMENT MENU ITEMS ||============================== //

const orderManagement = {
    id: 'marketing-management',
    title: 'Manage Marketing',
    caption: '',
    icon: icons.IconAdCircle,
    type: 'group',
    children: [
        {
            id: 'ads',  // Changed to lowercase and hyphenated
            title: 'Marketing',
            type: 'collapse',
            icon: icons.IconAdCircle,
            children: [
                {
                    id: 'create-ads',  // Lowercase and hyphenated for consistency
                    title: 'Create Ads',
                    type: 'item',
                    url: '/admin/create-ads',
                },
                {
                    id: 'ads-catalog',  // Lowercase and hyphenated
                    title: 'Ads Catalog',
                    type: 'item',
                    url: '/admin/ad-catalog',
                },
            ],
        },
    ],
};

export default orderManagement;
