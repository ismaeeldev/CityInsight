import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Box
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

export default function AuthForget() {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const handleForget = async () => {
        if (!email) {
            alert("Please enter your email!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/admin/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }

            alert(data.message || 'Password reset link sent!');

        } catch (error) {
            console.error("Error:", error);
            alert(error.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email-login"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address "
                />
            </FormControl>

            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button
                        onClick={handleForget}
                        color="secondary"
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Forget Password"}
                    </Button>
                </AnimateButton>
            </Box>
        </>
    );
}
