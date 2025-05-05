import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 3,
        mt: 'auto'
      }}
    >
      <Typography variant="caption">
        🌀 Crafted with passion by{' '}
        <Typography
          component={Link}
          href=""
          underline="hover"
          target="_blank"
          color="secondary.main"
        >
          𝓪𝓵𝓲𝓼𝓱𝓪,𝓵𝓪𝓲𝓫𝓪 ,𝓻𝓸𝓶𝓪𝓷
        </Typography>
      </Typography>


    </Stack>
  );
}
