import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { FormGroup, TextField, FormControlLabel } from '@mui/material';
import contactListRequests from '../requests/contactListRequests.js'
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/App.css';

export function ContactListComponent() {
    const [t] = useTranslation();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [contactNameError, setContactNameError] = useState(false);
    const [contactPhoneNumberError, setContactPhoneNumberError] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactAddtInfo, setContactAddtInfo] = useState('');
    const [updateTargetID, setUpdateTargetID] = useState('');

    const handleOpenCreate = () => setOpenCreate(true);

    const handleOpenUpdate = async (contactID) => {
        const contactInfo = await getContact(contactID);
        setContactName(contactInfo.contact_name);
        setContactPhoneNumber(contactInfo.contact_phone_number);
        setContactEmail(contactInfo.contact_email);
        setContactAddtInfo(contactInfo.additional_info);
        setUpdateTargetID(contactID);
        setOpenUpdate(true);
    };

    const handleClose = () => {
        setOpenUpdate(false);
        setOpenCreate(false);
        enableTextFields(false);
        cleanModalFields();
    };
    const switchHandler = (event) => {
        enableTextFields(event.target.checked);
    };

    const dataGridLocales = localizedComponents.DatagridLocales();

    const columns = [
        {
            field: 'contact_name', headerName: t('title_contact_name'), width: 200, renderCell: (params) => (
                <Link underline="none" rel="noopener" onClick={() => { handleOpenUpdate(params.id) }}>{params.value}</Link>
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
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => { deleteContact(params.id) }}
                    showInMenu
                />,
            ],
        }
    ]

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

    async function getContact(contactID) {
        return await contactListRequests.getContact(contactID);
    };

    async function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                contact_name: contactName,
                contact_phone_number: contactPhoneNumber
            },
            filter: {}
        };
        if (contactEmail !== '') requestBody.body.contact_email = contactEmail;
        if (contactAddtInfo !== '') requestBody.body.additional_info = contactAddtInfo;
        if (openCreate) {
            await contactListRequests.insertContact(JSON.stringify(requestBody));
            setOpenCreate(false);
        } else if (openUpdate) {
            requestBody.filter._id = updateTargetID;
            await contactListRequests.updateContact(JSON.stringify(requestBody));
            enableTextFields(false);
            setOpenUpdate(false);
        }
        cleanModalFields();
        loadContacList();
    };

    async function deleteContact(contactID) {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: contactID,
            }
        }
        await contactListRequests.deleteContact(JSON.stringify(requestBody))
        loadContacList();

    };

    function validateRequiredFields() {
        let error = false;
        if (contactName === "") {
            setContactNameError(true);
            return true;
        } else {
            error = false;
            setContactNameError(false);
        }
        if (contactPhoneNumber === "") {
            setContactPhoneNumberError(true);
            return true;
        } else {
            error = false;
            setContactPhoneNumberError(false);
        }
        return error;
    };

    function cleanModalFields() {
        setContactName('');
        setContactPhoneNumber('');
        setContactEmail('');
        setContactAddtInfo('');
        setUpdateTargetID('');
    };

    function enableTextFields(checked) {
        setIsEditing(checked);
    };

    useEffect(() => {
        loadContacList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }}>
                    {t('title_contact_list')}
                </Button>
                <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_contact')} </Button>
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
                aria-describedby="modal-modal-content" >
                <Box className='modal-box'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_create_new_contact')}
                    </Typography>
                    <FormGroup>
                        <TextField fullWidth error={contactNameError} required id='contact_name'
                            label={t('label_contact_name')} value={contactName}
                            onChange={functionUtils.handleSetInput(setContactName)} />
                        <TextField fullWidth error={contactPhoneNumberError} type="tel" required id='contact_phone_number' inputProps={{ inputMode: 'numeric' }}
                            label={t('label_contact_phone_number')} value={contactPhoneNumber}
                            onChange={functionUtils.handleSetInput(setContactPhoneNumber)} />
                        <TextField fullWidth type="email" id='contact_email'
                            label={t('label_contact_email')} value={contactEmail}
                            onChange={functionUtils.handleSetInput(setContactEmail)} />
                        <TextField fullWidth multiline rows={10} id='contact_addtInfo'
                            label={t('label_additional_info')} value={contactAddtInfo}
                            onChange={functionUtils.handleSetInput(setContactAddtInfo)} />
                        <Button onClick={handleSubmit}>{t('button_create')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
            <Modal
                open={openUpdate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content" >
                <Box className='modal-box'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_update_contact')}
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label="Enable editing" />
                        <TextField fullWidth error={contactNameError} required id='contact_name'
                            disabled={!isEditing} label={t('label_contact_name')} value={contactName}
                            onChange={functionUtils.handleSetInput(setContactName)}></TextField>
                        <TextField fullWidth error={contactPhoneNumberError} required id='contact_phone_number'
                            disabled={!isEditing} label={t('label_contact_phone_number')} value={contactPhoneNumber}
                            onChange={functionUtils.handleSetInput(setContactPhoneNumber)}></TextField>
                        <TextField fullWidth type="email" id='contact_email'
                            disabled={!isEditing} label={t('label_contact_email')} value={contactEmail}
                            onChange={functionUtils.handleSetInput(setContactEmail)}></TextField>
                        <TextField fullWidth multiline rows={10} id='contact_addtInfo'
                            disabled={!isEditing} label={t('label_additional_info')} value={contactAddtInfo}
                            onChange={functionUtils.handleSetInput(setContactAddtInfo)}></TextField>
                        <Button disabled={!isEditing} onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
        </div>
    );
}
