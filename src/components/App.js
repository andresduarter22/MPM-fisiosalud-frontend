import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Calendar } from './Calendar.js'
import { StoreArticlesList } from './Shop.js'
import { Patients } from './Patients.js'
import { ContactList } from './ContactList.js'
import { Staff } from './Staff.js'
import { WorkingArea } from "./WorkingAreaList.js";
import { MainToolbar } from "./MainToolbar.js";
import { TreatmentsList } from "./Treatments.js";
import { Login } from "./Login.js";
import { getCookie } from "../utils/cookiesManager.js";
import '../styles/App.css';

export function App() {
    const [t] = useTranslation();
    const pages = [t("title_calendar"), t("title_patitent"), t("title_working_areas_list"), t("title_contact_list"), t("title_treatments_list"), t("title_shop_Article"), t("title_staff")];
    const pageClasses = [<Calendar/>, <Patients/>, <WorkingArea/>, <ContactList/>, <TreatmentsList/>, <StoreArticlesList/>, <Staff/>]
    // if (getCookie("access_token") === undefined) {
    //     return <Login />
    // }
    
    // else {
        return (
            <BrowserRouter>
                <div className="main-container">
                    <MainToolbar pages={pages} />
                    <div className="main-content">
                        <Routes>
                            <Route path='/' element={<Calendar/>} exact />
                            {pages.map((page) => (
                                <Route key={page} path={`/${page}`} element={pageClasses[pages.indexOf(page)]} exact />
                            ))}
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        );
    // }
};
