import { Link as RouterLink } from 'react-router-dom';
import '../styles/App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export function MainToolbar(props) {
    return (
        <AppBar position="static" className="main-toolbar">
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Toolbar disableGutters>
                        {props.pages.map((page) => (
                            <Link
                                key={page}
                                component={RouterLink}
                                to={`/${page}`}
                                className="main-toolbar-link"
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        my: 0.5,
                                        mx: 1,
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        transition: 'background-color 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </Toolbar>
                </Box>
            </Container>
        </AppBar>
    );
};
