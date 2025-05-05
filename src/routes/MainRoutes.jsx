import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoutes';
import MainLayout from 'layout/MainLayout';
import Sample from '../views/Error/Sample';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AccessDenied = Loadable(lazy(() => import('views/Error/AccessDenied')));
const AddProduct = Loadable(lazy(() => import('views/pages/product/addProduct')));
const AllProduct = Loadable(lazy(() => import('views/pages/product/allProduct')));
const EditProduct = Loadable(lazy(() => import('views/pages/product/editProduct')));
const AllCategory = Loadable(lazy(() => import('views/pages/category/allCategory')));
const AllOrder = Loadable(lazy(() => import('views/pages/order/allOrder')));
const AllPermission = Loadable(lazy(() => import('views/pages/permission/allPermission')));
const AllUser = Loadable(lazy(() => import('views/pages/user/allUser')));
const Addads = Loadable(lazy(() => import('views/pages/ads/createAds')));
const AdCatalog = Loadable(lazy(() => import('views/pages/ads/adCatalog')));
const EditAds = Loadable(lazy(() => import('views/pages/ads/editAds')));
const RoleRequests = Loadable(lazy(() => import('views/pages/user/roleRequest')));
// ==============================|| MAIN ROUTING ||============================== //


// {
//   index: true,
//     element: (
//       <iframe
//         src="https://www.mywebsite.com"
//         style={{ width: '100%', height: '100vh', border: 'none' }}
//         title="Main Website"
//       />
//     )
// }


const MainRoutes = {
  path: '/',
  children: [
    {
      index: true,
      element: (
        <iframe
          src="https://city-insights-nine.vercel.app"
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Main Website"
        />
      )
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },

    // 🔒 Admin routes with MainLayout
    {
      path: 'admin',
      element: <AdminRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              index: true, // Redirect `/admin` to `/admin/dashboard`
              element: <Navigate to="dashboard" />
            },
            {
              path: 'dashboard',
              element: <DashboardDefault />
            },
            {
              path: 'all-category',
              element: <AllCategory />
            },
            {
              path: 'access-denied',
              element: <AccessDenied />
            },
            {
              path: 'add-post',
              element: <AddProduct />
            },
            {
              path: 'all-post',
              element: <AllProduct />
            },
            {
              path: 'edit-product/:id',
              element: <EditProduct />
            },
            {
              path: 'all-order',
              element: <AllOrder />
            },
            {
              path: 'all-permission',
              element: <AllPermission />
            },
            {
              path: 'all-user',
              element: <AllUser />
            },
            {
              path: 'create-ads',
              element: <Addads />
            },
            {
              path: 'ad-catalog',
              element: <AdCatalog />
            },
            {
              path: 'edit-ad/:id',
              element: <EditAds />
            },
            {
              path: 'role-requests',
              element: <RoleRequests />
            },

          ]
        }
      ]
    }


  ]
};

export default MainRoutes;
