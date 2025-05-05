import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = () => {
    const adminToken = Cookies.get('adminToken'); // Ensure correct key name

    return adminToken ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;
