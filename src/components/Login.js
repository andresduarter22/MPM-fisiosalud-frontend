// create login page
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import '../styles/App.css';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import requester from "../apiRequester/Requester.js"
import Button from '@mui/material/Button';
import { setCookie } from "../utils/cookiesManager.js";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { t } = useTranslation();

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        const response = await requester.login(username, password);
        if (response.status === 200) {
            setIsLoggedIn(true);
            const cookies = await response.json();
            console.log("cookies: ", cookies);
            if (cookies) {
                for (const [key, value] of Object.entries(cookies)) {
                    console.log(`${key}: ${value}`);
                    setCookie(key, value);
                  }
                window.location.href = '/';
            }
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false);
    }

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 100 }}>
                <h4>{t('login.title')}</h4>
            </div>
            <div className="App-content">
                <div className="App-content-login">
                    <div className="App-content-login-form">
                        <FormControl>
                            <TextField
                                htmlFor="username"
                                id="username"
                                type="text"
                                label={t('login.username')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t('login.usernamePlaceholder')}
                                disabled={isLoading}
                                required
                            >
                            </TextField>
                        </FormControl>
                        <FormControl>
                            <TextField
                                htmlFor="password"
                                id="password"
                                type="password"
                                label={t('login.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.passwordPlaceholder')}
                                disabled={isLoading}
                                required
                            >
                            </TextField>
                        </FormControl>
                        <div className="App-content-login-form-buttons">
                            <Button

                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                {t('login.login')}
                            </Button>
                        </div>
                    </div>
                    <div className="App-content-login-error">
                        {error && <div className="App-content-login-error-message">{error}</div>}
                    </div>
                </div>
                <div className="App-content-login-status">
                    {isLoggedIn && <div className="App-content-login-status-message">{t('login.loggedIn')}</div>}
                </div>
            </div>
        </div>
    );
}
