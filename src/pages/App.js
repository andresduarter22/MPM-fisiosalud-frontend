import React from 'react';
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch, NavLink  } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import { Calendar } from './Calendar.js'
import { Patitents } from './Patients.js'
import { Files } from './Files.js'
import { Settings } from './Settings.js'

export function App(){
  const [ t ] = useTranslation();
    return (  
      <body> 
       <BrowserRouter>
        <div>
          <NavLink to="/Calendar">Calendar</NavLink>
          <NavLink to="/Patitent">Patitent's list</NavLink>
          <NavLink to="/Files">Files</NavLink>
          <NavLink to="/Settings">Settings</NavLink>
            <Switch>
              <Route path="/Calendar" Component={Calendar} exact/>
              <Route path="/Patitent" Component={Patitents} exact/>
              <Route path="/Files" Component={Files} exact/>
              <Route path="/Settings" Component={Settings} exact/>
           </Switch>
        </div> 
        <div>
          <p>
          {t("Hello")}
          </p>
        </div>
      </BrowserRouter>
      </body>
    );
}