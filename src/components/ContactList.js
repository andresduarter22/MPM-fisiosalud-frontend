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
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    // const [contactNameError, setContactNameError] = useState(false);
    // const [contactPhoneNumberError, setContactPhoneNumberError] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [updateTargetID, setUpdateTargetID] = useState('');
    const handleOpenCreate = () => setOpenCreate(true);
    const handleOpenUpdate = async (contactID) => {
        const contactInfo = await getContact(contactID);
        setContactName(contactInfo['contact_name']);
        setContactPhoneNumber(contactInfo['contact_phone_number']);
        setUpdateTargetID(contactID);
        setOpenUpdate(true);
    };
    const handleClose = () => {
        setOpenUpdate(false);
        setOpenCreate(false);
        cleanModalFields();
    };

    const dataGridLocales = localizedComponents.DatagridLocales();
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
                    onClick={() => { handleOpenUpdate(params.id) }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => { deleteContact(params.id) }}
                    showInMenu
                />,
            ],
        }
    ]

    // TODO: move to another file
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

    async function loadContacList() {
        try {
            const contactList = await contactListRequests.getContactList();
            setElements(contactList)
            setIsLoaded(true)
        } catch (error) {
            setIsLoaded(true)
            console.log(error)
        };
    };

    async function createContact() {
        setIsLoaded(false);
        const requestBody = {
            'body': {
                'contact_name': contactName,
                'contact_phone_number': contactPhoneNumber
            }
        }
        await contactListRequests.insertContact(JSON.stringify(requestBody))
        loadContacList();
        cleanModalFields();

        setOpenCreate(false);
    };

    async function deleteContact(contactID) {
        setIsLoaded(false);
        const requestBody = {
            'filter': {
                '_id': contactID,
            }
        }
        await contactListRequests.deleteContact(JSON.stringify(requestBody))
        loadContacList();

    };

    async function getContact(contactID) {
        return await contactListRequests.getContact(contactID);
    };

    async function updateContact() {
        setIsLoaded(false);
        const requestBody =
        {
            'filter': {
                '_id': updateTargetID,
            },
            'body': {
                'contact_name': contactName,
                'contact_phone_number': contactPhoneNumber
            }
        }

        await contactListRequests.updateContact(JSON.stringify(requestBody))
        loadContacList();
        cleanModalFields();
        setOpenUpdate(false);
    };

    function cleanModalFields() {
        setContactName('');
        setContactPhoneNumber('');
        setUpdateTargetID('');
    };

    useEffect(() => {
        loadContacList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button onClick={handleOpenCreate}> {t('add_new_contact_button')} </Button>
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
                open={openCreate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('create_new_contact_title')}
                    </Typography>
                    <div id="modal-modal-content" style={{ marginTop: 20 }}>
                        <div id="contact_name_input">
                            <TextField fullWidth required id='contact_name' placeholder='contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        </div>
                        <div id="contact_phone_number_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth required id='contact_phone_number' placeholder='contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        </div>
                        <div id="create_btn" style={{ marginTop: 15, float: 'right' }}>
                            <Button onClick={createContact}>Create</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openUpdate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update contact
                    </Typography>
                    <div id="modal-modal-content" style={{ marginTop: 20 }}>
                        <div id="contact_name_input">
                            <TextField fullWidth required id='contact_name' placeholder='contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        </div>
                        <div id="contact_phone_number_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth required id='contact_phone_number' placeholder='contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        </div>
                        <div id="create_btn" style={{ marginTop: 15, float: 'right' }}>
                            <Button onClick={updateContact}>Update</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
