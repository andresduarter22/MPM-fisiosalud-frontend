import React from 'react';
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import '../styles/App.css';
import { Calendar } from './Calendar.js'
import { Patitents } from './Patients.js'
import { ContactListComponent } from './ContactList.js'
import { Files } from './Files.js'
import { Settings } from './Settings.js'

export function App() {
    const [t] = useTranslation();
    async function retrieveData() {
        // setCount(JSON.stringify(await contactListRequests.getContactList()));
    };
    retrieveData();

    return (
        <div>
            <BrowserRouter>
                <div>
                    <NavLink to="/Calendar">{t("title_calendar")}</NavLink>
                    <NavLink to="/Patitent">{t("title_patitent")}</NavLink>
                    <NavLink to="/ContactList">{t("title_contact_list")}</NavLink>
                    <NavLink to="/Files">{t("title_files")}</NavLink>
                    <NavLink to="/Settings">{t("title_settings")}</NavLink>
                    <Switch>
                        <Route path="/Calendar" component={Calendar} exact />
                        <Route path="/Patitent" component={Patitents} exact />
                        <Route path="/ContactList" component={ContactListComponent} exact />
                        <Route path="/Files" component={Files} exact />
                        <Route path="/Settings" component={Settings} exact />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}