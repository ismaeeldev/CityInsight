import React from 'react';
import { useNavigate } from 'react-router';

const WorkingOnProject = () => {
    const navigate = useNavigate();

    const handleGo = () => {
        navigate('/admin');
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.text}>Working on main website </h1>
            <a style={styles.button} onClick={handleGo} >Dashboard</a>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: "column",
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
    },
    text: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default WorkingOnProject;
