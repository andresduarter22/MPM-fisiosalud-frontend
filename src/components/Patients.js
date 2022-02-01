import logo from '../logo.svg';
import '../styles/App.css';

export function Patients() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p id="demo" src="../requests/patient.js">
                    Hello!!fdsf
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="demo"
                >
                </a>
            </header>
        </div>
    );
}