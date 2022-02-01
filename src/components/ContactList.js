import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/App.css';
import '../styles/App.css';
import contactListRequests from '../requests/contactListRequests.js'

export function ContactListComponent() {
    //TODO: change count var name. 
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        contactListRequests.getContactList().then(result => {
            setElements(result)
            setIsLoaded(true)
        }, error => {
            setIsLoaded(true)
            console.log(error)
        });
    }, []);
    const columns = [
        { field: 'contact_name', headerName: 'Contact Name', width: 200 },
        { field: 'contact_phone_number', headerName: 'Phone Number', width: 200 }
    ]

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div style={{ height: 400, width: '100%', background: 'white' }}>
                <DataGrid
                    rows={elements}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    getRowId={(row) => row._id}
                />
            </div>
        );
    }
}
