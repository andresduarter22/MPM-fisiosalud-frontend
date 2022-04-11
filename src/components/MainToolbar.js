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
        <AppBar position="static">
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Toolbar disableGutters>
                        {props.pages.map((page) => (
                            <Link key={page} component={RouterLink} to={`/${page}`} sx={{ my: 2, color: 'white', display: 'block' }}>
                                <Button sx={{ my: 0.5, color: 'white', display: 'block' }}>
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
