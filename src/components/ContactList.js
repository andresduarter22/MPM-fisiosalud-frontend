import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import '../styles/App.css';
import contactListRequests from '../requests/contactListRequests.js'
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'

export function ContactListComponent() {
    const [t] = useTranslation();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const columns = [
        { field: 'contact_name', headerName: 'Contact Name', width: 200 },
        { field: 'contact_phone_number', headerName: 'Phone Number', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => {updateContact(params)}}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => {deleteContact(params.id)}}
                    showInMenu
                />,
            ],
        }
    ]

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const dataGridLocales = localizedComponents.DatagridLocales();

    function loadContacList() {
        contactListRequests.getContactList().then(result => {
            setElements(result)
            setIsLoaded(true)
        }, error => {
            setIsLoaded(true)
            console.log(error)
        });
    }

    function createContact() {
        const requestBody = {
            'body': {
                'contact_name': contactName,
                'contact_phone_number': contactPhoneNumber
            }
        }
        contactListRequests.insertContact(JSON.stringify(requestBody));
        setOpen(false);
        loadContacList();
    }

    function deleteContact(contactID) {
        const requestBody = {
            'filter': {
                '_id': contactID,
            }
        }
        contactListRequests.deleteContact(JSON.stringify(requestBody));
        loadContacList();
    }

    function updateContact(params) {
        let contactInfo = contactListRequests.getContact(params.id).then(result => {
            return result
        }, error => {
            console.log(error)
        });
        console.log(contactInfo)
        const requestBody =
        {
            'filter': {
                '_id': params.id,
            },
            'body': {
                'contact_name': contactInfo.contact_name,
                'contact_phone_number': contactInfo.contact_phone_number
            }
        }
        console.log(requestBody)
        // contactListRequests.updateContact(JSON.stringify(requestBody));
        setOpen(false);
    }

    useEffect(() => {
        loadContacList();
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div>
                    <Button onClick={handleOpen}> {t('add_new_contact_button')} </Button>
                </div>
                <div style={{ height: 600, width: '100%', background: 'white' }}>
                    <DataGrid
                        rows={elements}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        localeText={dataGridLocales}
                    />
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-content"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('create_new_contact_title')}
                        </Typography>
                        <div id="modal-modal-content">
                            <div id="contact_name_input" style={{ height: 100 }}>
                                <TextField fullWidth required id='contact_name' placeholder='contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                            </div>
                            <div id="contact_phone_number_input" style={{ height: 100 }}>
                                <TextField fullWidth required id='contact_phone_number' placeholder='contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                            </div>
                            <div id="create_btn">
                                <Button onClick={createContact}>Create</Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }
}
