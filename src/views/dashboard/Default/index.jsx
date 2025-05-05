import { useEffect, useState, useContext } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { useNavigate } from 'react-router-dom';


import { MainContext } from '../../context';
import AccessDenied from '../../Error/AccessDenied'
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import Swal from 'sweetalert2'


// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [DashboardApi, setDashboardApi] = useState({})
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { adminRole } = useContext(MainContext);

  if (adminRole?.toLowerCase() !== "admin") {
    return (
      <AccessDenied />
    );
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const adminToken = getCookie("adminToken");


  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          Swal.fire({
            title: 'Error!',
            text: 'Token Expired',
            icon: 'error',
            confirmButtonText: 'Logout'
          })
          setTimeout(() => navigate('/admin/login'), 2000);
          return;
        }
        else if (response.status === 403) {
          navigate('/admin/access-denied');
          return;
        }
        else if (response.status === 404) {
          Swal.fire({
            title: 'Error!',
            text: 'Please Login again',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          setTimeout(() => navigate('/admin/login'), 2000);
        } else if (response.status === 500) {
          throw new Error("Server error, please try again later");
        } else {
          throw new Error(`Unexpected error: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setDashboardApi(data);
    } catch (error) {
      console.error("Dashboard API Error:", error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
    setLoading(false);

  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} totalEarning={DashboardApi.totalUsers} />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} monthlyOrder={DashboardApi.totalPostsThisMonth} yearlyOrder={DashboardApi.totalPostsThisYear} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard isLoading={isLoading} total={DashboardApi.totalPostsToday} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: DashboardApi.totalUsersToday,
                    label: 'Today new user',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TotalGrowthBarChart data={DashboardApi.graphData} isLoading={isLoading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard data={DashboardApi.recentPosts} isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
