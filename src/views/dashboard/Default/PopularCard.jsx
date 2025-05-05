import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
// asets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';


export default function PopularCard({ data, isLoading }) {
  const [latestSale, setLatestSale] = useState({})
  const navigate = useNavigate()

  const handleAll = () => {
    navigate('/admin/all-post')
  }

  useEffect(() => {
    setLatestSale(data);
  }, [data]); // ⚡ Update whenever props.data changes

  useEffect(() => {
    const interval = setInterval(() => {
      setLatestSale(data);
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // clean on unmount
  }, [data]);

  const isLoadingState = isLoading || !latestSale || latestSale.length === 0;

  return (
    <>
      {isLoadingState ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid size={12}>
                <Grid container sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
                  <Grid>
                    <Typography variant="h4">Latest Posts</Typography>
                  </Grid>

                </Grid>
              </Grid>

              {latestSale && latestSale.map((order, index) => (

                <Grid size={12}>
                  <Grid container direction="column">
                    <Grid>
                      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid>
                          <Typography variant="subtitle1" color="inherit">
                            {order.title}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-around' }}>

                            <Grid>
                              <Typography variant="subtitle2" sx={{ marginLeft: '5px', color: order.paymentStatus == 'paid' ? 'success.dark' : 'orange.dark' }}>
                                {order.author.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                        {order.author.role}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1.5 }} />
                </Grid>
              ))}

            </Grid>

          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation onClick={handleAll}>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { isLoading: PropTypes.bool };
