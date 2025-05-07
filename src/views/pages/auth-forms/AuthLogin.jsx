import { useState, useContext } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'js-cookie';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { MainContext } from '../../context';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';


export default function AuthLogin() {
  const theme = useTheme();
  const [checked, setChecked] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { setAdminRole, setAdminName } = useContext(MainContext)
  const [loading, setLoading] = useState(false);



  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.token;
      setAdminRole(data.user.role);
      setAdminName(data.user.name);

      Cookies.set('adminToken', token, { expires: 14 });

      // 👉 Wait for Swal confirmation, then navigate
      await Swal.fire({
        title: 'Login Successful',
        text: 'You have successfully logged in.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Something went wrong during login.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }

  };



  return (
    <>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Email Address </InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          value={email}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address "
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          />
        </Grid>

      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button onClick={handleLogin} color="secondary" fullWidth size="large" type="submit" variant="contained">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}

          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
