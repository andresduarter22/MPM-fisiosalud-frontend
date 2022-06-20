// create login page
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import '../styles/App.css';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import requester from "../apiRequester/Requester.js"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { setCookie } from "../utils/cookiesManager.js";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { t } = useTranslation();

    const handleLogin = async () => {
        if (validateRequiredFields()) return;
        setIsLoading(true);
        const response = await requester.requestLogin(username, password);
        if (response.status === 200) {
            setIsLoggedIn(true);
            const cookies = await response.json();
            if (cookies) {
                for (const [key, value] of Object.entries(cookies)) {
                    setCookie(key, value);
                  }
                window.location.href = '/';
            }
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false);
    };

    function validateRequiredFields() {
        let error = false;
        if (username === '') {
            setUsernameError(t('usernameRequired'));
            error = true;
        } else {
            setUsernameError(false);
            error = false;
        }
        if (password === '') {
            setPasswordError(t('passwordRequired'));
            error = true;
        } else {
            setPasswordError(false);
            error = false;
        }
        return error;
    }; 

    return (
        // TODO: Fix UI of login page
        <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginTop: "2%" }}>
            <Typography 
            variant="h4" 
            component={Typography}
            sx={{textColor: 'primary', fontWeight: 'bold'}}          
            >{t('title_login')}</Typography>
            </div>
            <div className="App-content">
                <div className="App-content-login">
                    <div className="App-content-login-form">
                        <FormControl>
                            <TextField
                                htmlFor="username"
                                id="username"
                                type="text"
                                error={usernameError}
                                label={t('label_login_username')}
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
                                error={passwordError}
                                label={t('label_login_password')}
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
                                {t('button_login')}
                            </Button>
                        </div>
                    </div>
                    {/* <div className="App-content-login-error">
                        {error && <div className="App-content-login-error-message">{error}</div>}
                    </div> */}
                </div>
                <div className="App-content-login-status">
                    {isLoggedIn && <div className="App-content-login-status-message">{t('login.loggedIn')}</div>}
                </div>
            </div>
        </div>
    );
};
