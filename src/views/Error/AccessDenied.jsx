import React from 'react';
import { useNavigate } from 'react-router-dom';
import { gridSpacing } from '../../store/constant';
import Grid from '@mui/material/Grid2';


const AccessDenied = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); // Change to the desired route
    };

    return (

        <div style={styles.container}>
            <h1 style={styles.heading}>Access Denied</h1>
            <hr style={styles.hr} />
            <h3 style={styles.message}>You don't have permission to view this.</h3>
            <h3 style={styles.icons}>🚫🚫🚫🚫</h3>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        color: 'white',
        textAlign: 'center',
    },
    heading: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'red',
        animation: 'fadeInDown 1s',
    },
    hr: {
        width: '50%',
        border: '1px solid black',
        animation: 'slideInLeft 1s',
    },
    message: {
        fontSize: '1.5rem',
        animation: 'fadeInRight 1s',
        color: "black"
    },
    icons: {
        fontSize: '2rem',
        animation: 'zoomIn 1s',
    },

};

export default AccessDenied;
