// create login page
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import '../styles/App.css';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import requester from "../apiRequester/Requester.js"
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { setCookie } from "../utils/cookiesManager.js";
import companyLogo from '../src/logo.png'

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
        <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%', backgroundColor: '#282C34' }} >
            <div style={{ marginTop: '2%', marginBottom: '20px', borderRadius: '8px' }}>
                <img src={companyLogo} alt="Company Logo" style={{ width: '150px', borderRadius: '8px' }} />
            </div>
            <div className="App-content">
            <Card style={{ maxWidth: '400px', width: '100%', borderRadius: '8px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
                <CardContent>
                    <FormControl>
                        <TextField
                            htmlFor="username"
                            id="username"
                            type="text"
                            error={usernameError}
                            label={t('label_login_username')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('label_login_username')}
                            disabled={isLoading}
                            required

                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '20px' }}
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
                            placeholder={t('label_login_password')}
                            disabled={isLoading}
                            required

                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '20px' }}
                        >
                        </TextField>
                    </FormControl>
                    <div className="App-content-login-form-buttons">
                        <Button
                            onClick={handleLogin}
                            disabled={isLoading}
                            
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '20px' }}
                        >
                            {t('button_login')}
                        </Button>
                        </div>
                        {/* <div className="App-content-login-error">
                            {error && <div className="App-content-login-error-message">{error}</div>}
                        </div> */}
                </CardContent>
            </Card>
                <div className="App-content-login-status">
                    {isLoggedIn && <div className="App-content-login-status-message">{t('login.loggedIn')}</div>}
                </div>
            </div>
        </div>
    );
};
