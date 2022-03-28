import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { TextField } from '@mui/material';
import '../styles/App.css';
// import CustomSwitch from './element/CustomSwitch.js';
import contactListRequests from '../requests/contactListRequests.js'
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'

export function ContactListComponent() {
    const [t] = useTranslation();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openInfo, setopenInfo] = useState(false);
    const [contactNameError, setContactNameError] = useState(false);
    const [contactPhoneNumberError, setContactPhoneNumberError] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [contactAddtInfo, setContactAddtInfo] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [updateTargetID, setUpdateTargetID] = useState('');
    const [contactNameEditable, setContactNameEditable] = useState(false);
    const [contactPhoneNumberEditable, setContactPhoneNumberEditable] = useState(false);
    const [contactAddtInfoEditable, setContactAddtInfoEditable] = useState(false);
    const [contactEmailEditable, setContactEmailEditable] = useState(false);
    const [saveButtonEditable, setsaveButtonEditable] = useState(false);
    const [checked, setChecked] = useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleOpenInfo = async (contactID) => {
        const contactInfo = await getContact(contactID);
        setContactName(contactInfo['contact_name']);
        setContactPhoneNumber(contactInfo['contact_phone_number']);
        setContactEmail(contactInfo['contact_email']);
        setContactAddtInfo(contactInfo['additional_info']);
        setopenInfo(true)
    };
    const handleOpenUpdate = async (contactID) => {
        const contactInfo = await getContact(contactID);
        enableEditable();
        setContactName(contactInfo['contact_name']);
        setContactPhoneNumber(contactInfo['contact_phone_number']);
        setContactEmail(contactInfo['contact_email']);
        setContactAddtInfo(contactInfo['additional_info']);
        setUpdateTargetID(contactID);
        setOpenUpdate(true);
    };
    const handleClose = () => {
        setOpenUpdate(false);
        setOpenCreate(false);
        setopenInfo(false);
        cleanModalFields();
    };
    const switchHandler = (event) => {
        setChecked(event.target.checked);
        enableEditable();
      };

    const dataGridLocales = localizedComponents.DatagridLocales();
    const columns = [
        {
            field: 'contact_name', headerName: t('title_contact_name'), width: 200, renderCell: (params) => (
                <Link onClick={() => { handleOpenInfo(params.id) }}>{params.value}</Link>
            )
        },
        { field: 'contact_phone_number', headerName: t('title_contact_phone_number'), width: 200 },
        { field: 'contact_email', headerName: t('title_contact_email'), width: 200 },
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
        let error = false;
        if (contactName === "") {
            setContactNameError(true);
            error = true;
        } else {
            error = false;
            setContactNameError(false);
        }
        if (contactPhoneNumber === "") {
            setContactPhoneNumberError(true);
            error = true;
        } else {
            error = false;
            setContactPhoneNumberError(false);
        }
        if (error) return;

        setIsLoaded(false);
        const requestBody = {
            'body': {
                'contact_name': contactName,
                'contact_phone_number': contactPhoneNumber
            }
        }
        if (contactEmail !== '') requestBody.body['contact_email'] = contactEmail
        if (contactEmail !== '') requestBody.body['additional_info'] = contactAddtInfo
        await contactListRequests.insertContact(JSON.stringify(requestBody));
        enableEditable();
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
        let error = false;
        if (contactName === "") {
            setContactNameError(true);
            error = true;
        } else {
            error = false;
            setContactNameError(false);
        }
        if (contactPhoneNumber === "") {
            setContactPhoneNumberError(true);
            error = true;
        } else {
            error = false;
            setContactPhoneNumberError(false);
        }
        if (error) return;
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
        if (contactEmail !== '') requestBody.body['contact_email'] = contactEmail
        if (contactEmail !== '') requestBody.body['additional_info'] = contactAddtInfo
        await contactListRequests.updateContact(JSON.stringify(requestBody))
        loadContacList();
        cleanModalFields();
        setOpenUpdate(false);
    };

    function cleanModalFields() {
        setContactName('');
        setContactPhoneNumber('');
        setContactEmail('');
        setContactAddtInfo('');
        setUpdateTargetID('');
    };

    useEffect(() => {
        loadContacList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    const enableEditable = () => {
        setContactNameEditable(checked);
        setContactPhoneNumberEditable(checked);
        setContactEmailEditable(checked);
        setContactAddtInfoEditable(checked);
        setsaveButtonEditable(checked);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" gutterBottom component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }}>
                    {t('title_contact_list')}
                </Button>
                <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('add_new_contact_button')} </Button>
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
                            <TextField fullWidth error={contactNameError} required id='contact_name'
                                placeholder='Contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        </div>
                        <div id="contact_phone_number_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth error={contactPhoneNumberError} type="tel" required id='contact_phone_number'
                                placeholder='Contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        </div>
                        <div id="contact_email_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth type="email" id='contact_email'
                                placeholder='Contact E-mail' value={contactEmail} onChange={functionUtils.handleSetInput(setContactEmail)}></TextField>
                        </div>
                        <div id="contact_addtInfo_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth multiline id='contact_addtInfo'
                                placeholder='Contact Additional Information' value={contactAddtInfo} onChange={functionUtils.handleSetInput(setContactAddtInfo)}></TextField>
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
                    <Switch checked={checked} onChange={switchHandler} />
                        <div id="contact_name_input">
                            <TextField fullWidth error={contactNameError} required id='contact_name'
                                disabled = {contactNameEditable} placeholder='contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        </div>
                        <div id="contact_phone_number_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth error={contactPhoneNumberError} required id='contact_phone_number'
                                disabled = {contactPhoneNumberEditable} placeholder='contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        </div>
                        <div id="contact_email_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth type="email" id='contact_email'
                                disabled = {contactEmailEditable} placeholder='Contact E-mail' value={contactEmail} onChange={functionUtils.handleSetInput(setContactEmail)}></TextField>
                        </div>
                        <div id="contact_addtInfo_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth multiline id='contact_addtInfo'
                                disabled = {contactAddtInfoEditable} placeholder='Contact Additional Information' value={contactAddtInfo} onChange={functionUtils.handleSetInput(setContactAddtInfo)}></TextField>
                        </div>
                        <div id="create_btn" style={{ marginTop: 15, float: 'right' }}>
                            <Button disabled = {saveButtonEditable} onClick={updateContact}>Update</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openInfo}
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
                            <TextField fullWidth error={contactNameError} required id='contact_name'
                                placeholder='contact name' value={contactName} onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        </div>
                        <div id="contact_phone_number_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth error={contactPhoneNumberError} required id='contact_phone_number'
                                disabled placeholder='contact phone number' value={contactPhoneNumber} onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        </div>
                        <div id="contact_email_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth type="email" id='contact_email'
                                disabled placeholder='Contact E-mail' value={contactEmail} onChange={functionUtils.handleSetInput(setContactEmail)}></TextField>
                        </div>
                        <div id="contact_addtInfo_input" style={{ marginTop: 15 }}>
                            <TextField fullWidth multiline id='contact_addtInfo'
                                disabled placeholder='Contact Additional Information' value={contactAddtInfo} onChange={functionUtils.handleSetInput(setContactAddtInfo)}></TextField>
                        </div>
                        <div id="create_btn" style={{ marginTop: 15, float: 'right' }}>
                            <Button disabled onClick={updateContact}>Update</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
