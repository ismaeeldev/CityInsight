import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'ui-component/extended/AnimateButton';

export default function AuthReset() {
    const theme = useTheme();
    const { token } = useParams();
    console.log(token);
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleReset = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!token) {
            alert("Invalid or missing token.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/admin/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }

            alert(data.message || 'Password reset successful!');
            navigate('/admin/login');

        } catch (error) {
            console.error("Error:", error);
            alert(error.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                Reset Password
            </Typography>

            {/* New Password Field */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                <InputLabel htmlFor="outlined-adornment-newPassword">New Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="New Password"
                />
            </FormControl>

            {/* Confirm Password Field */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Confirm Password"
                />
            </FormControl>

            {/* Reset Password Button */}
            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button
                        onClick={handleReset}
                        color="secondary"
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </AnimateButton>
            </Box>
        </>
    );
}
