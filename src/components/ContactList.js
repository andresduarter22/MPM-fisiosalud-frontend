import '../styles/App.css';
import React, { useState } from 'react';
import '../styles/App.css';
import contactListRequests from '../requests/contactListRequests.js'

export function ContactListComponent() {

    const [count, setCount] = useState("");
    async function retrieveData() {
        setCount(JSON.stringify(await contactListRequests.getContactList()));
    };
    retrieveData();
    return (
        <div >
            <p >
                {count}
            </p>
        </div>
    );
}