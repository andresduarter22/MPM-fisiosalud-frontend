import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../styles/App.css';
import { Calendar } from './Calendar.js'
import { Shop } from './Shop.js'
import { Patients } from './Patients.js'
import { ContactListComponent } from './ContactList.js'
import { Files } from './Files.js'
import { Settings } from './Settings.js'
import { Staff } from './Staff.js'
import { WorkingAreaListComponent } from "./WorkingAreaList";
import { MainToolbar } from "./MainToolbar.js";

export function App() {
    const [t] = useTranslation();
    const pages = [t("title_calendar"), t("title_patitent"), t("title_working_areas_list"), t("title_contact_list"), t("title_files"), t("title_shop_Article"), t("title_settings"), t("title_staff")];
    const pageClasses = [Calendar, Patients, WorkingAreaListComponent, ContactListComponent, Files, Shop, Settings, Staff]

    return (
        <BrowserRouter>
            <div className="main-container">
                <MainToolbar pages={pages} />
                <div className="main-content">
                    <Switch>
                        {pages.map((page) => (
                            <Route key={page} path={`/${page}`} component={pageClasses[pages.indexOf(page)]} exact />
                        ))}
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};
