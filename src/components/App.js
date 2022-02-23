import React from 'react';
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch, Link as RouterLink } from 'react-router-dom';
import '../styles/App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { Calendar } from './Calendar.js'
import { Patients } from './Patients.js'
import { ContactListComponent } from './ContactList.js'
import { Files } from './Files.js'
import { Settings } from './Settings.js'

function MainToolbar(props) {
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
}
export function App() {
    const [t] = useTranslation();
    const pages = [t("title_calendar"), t("title_patitent"), t("title_contact_list"), t("title_files"), t("title_settings")];
    const pageClasses = [Calendar, Patients, ContactListComponent, Files, Settings]

    return (
        <BrowserRouter>
            <MainToolbar pages={pages} />
            <Switch>
                {pages.map((page) => (
                    <Route key={page} path={`/${page}`} component={pageClasses[pages.indexOf(page)]} exact />
                ))}
            </Switch>
        </BrowserRouter>
    );
}
