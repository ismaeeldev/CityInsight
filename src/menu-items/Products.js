
// import { IconKey } from '@tabler/icons-react';
import { IconBuildingStore } from '@tabler/icons-react';

// constant
const icons = {
    IconBuildingStore
};

// ==============================|| PRODUCT MANAGEMENT MENU ITEMS ||============================== //

const productManagement = {
    id: 'post-management',
    title: 'Manage Posts',
    caption: '',
    icon: icons.IconBuildingStore,
    type: 'group',
    children: [
        {
            id: 'posts',
            title: 'Posts',
            type: 'collapse',
            icon: icons.IconBuildingStore,
            children: [
                {
                    id: 'add-post',
                    title: 'Add Post',
                    type: 'item',
                    url: '/admin/add-post',

                },
                {
                    id: 'all-post',
                    title: 'All Posts',
                    type: 'item',
                    url: '/admin/all-post',

                }
            ]
        }
    ]
};

export default productManagement;
