import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import requester from '../apiRequester/Requester.js';
import functionUtils from '../utils/functionUtils.js';
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/App.css';

export function ContactList() {
    const [t] = useTranslation();
    const dataGridLocales = localizedComponents.DatagridLocales();
    const contactListEndpoint = 'contactList';
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactAddtInfo, setContactAddtInfo] = useState('');
    const [updateTargetID, setUpdateTargetID] = useState('');

    const [contactNameError, setContactNameError] = useState(false);
    const [contactPhoneNumberError, setContactPhoneNumberError] = useState(false);

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
                    icon={<EditIcon />}
                    label={t('button_edit')}
                    onClick={() => handleOpenUpdate(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => handleDelete(params.id)}
                    showInMenu
                />,
            ],
        }
    ];

    async function handleOpenCreate() { setOpenCreate(true) };

    async function handleOpenUpdate(contactID) {
        const contactInfo = await getContact(contactID);
        setContactName(contactInfo.contact_name);
        setContactPhoneNumber(contactInfo.contact_phone_number);
        setContactEmail(contactInfo.contact_email);
        setContactAddtInfo(contactInfo.additional_info);
        setUpdateTargetID(contactID);
        setOpenUpdate(true);
    };

    async function handleClose() {
        setOpenUpdate(false);
        setOpenCreate(false);
        enableTextFields(false);
        cleanModalFields();
    };

    async function switchHandler(event) {
        enableTextFields(event.target.checked);
    };

    async function loadContacList() {
        try {
            const contactList = await requester.requestGetList(contactListEndpoint);
            setElements(contactList)
            setIsLoaded(true)
        } catch (error) {
            setIsLoaded(true)
            console.log(error)
        };
    };

    async function getContact(contactID) {
        return await requester.requestGet(contactListEndpoint, contactID);
    };

    async function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                contact_name: contactName,
                contact_phone_number: contactPhoneNumber,
                contact_email: contactEmail,
                additional_info: contactAddtInfo
            },
            filter: {},
        };
        if (openCreate) {
            if (contactEmail === '') delete requestBody.body.contact_email;
            if (contactAddtInfo === '') delete requestBody.body.additional_info;
            await requester.requestInsert(contactListEndpoint, JSON.stringify(requestBody));
        } else if (openUpdate) {
            requestBody.filter._id = updateTargetID;
            await requester.requestUpdate(contactListEndpoint, JSON.stringify(requestBody));
        }
        handleClose();
        cleanModalFields();
        loadContacList();
    };

    async function handleDelete(contactID) {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: contactID,
            }
        }
        await requester.requestDelete(contactListEndpoint, JSON.stringify(requestBody))
        loadContacList();
    };

    
    async function cleanModalFields() {
        setContactName('');
        setContactPhoneNumber('');
        setContactEmail('');
        setContactAddtInfo('');
        setUpdateTargetID('');
    };
    
    async function enableTextFields(checked) {
        setIsEditing(checked);
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

    useEffect(() => {
        loadContacList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div"
                    style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_contact_list')}
                </Button>
            </div>

            <div style={{ height: 600, width: '100%', background: 'white' }}>
                <DataGrid
                    rows={elements}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
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
                        <TextField
                            fullWidth
                            error={contactNameError}
                            required
                            id='contact_name'
                            label={t('label_contact_name')}
                            value={contactName}
                            onChange={functionUtils.handleSetInput(setContactName)} />
                        <TextField
                            fullWidth
                            error={contactPhoneNumberError}
                            type="number"
                            required id='contact_phone_number'
                            inputProps={{ inputMode: 'numeric' }}
                            label={t('label_contact_phone_number')}
                            value={contactPhoneNumber}
                            onChange={functionUtils.handleSetInput(setContactPhoneNumber)} />
                        <TextField
                            fullWidth
                            type="email"
                            id='contact_email'
                            label={t('label_contact_email')}
                            value={contactEmail}
                            onChange={functionUtils.handleSetInput(setContactEmail)} />
                        <TextField fullWidth
                            multiline
                            rows={10}
                            id='contact_addtInfo'
                            label={t('label_additional_info')}
                            value={contactAddtInfo}
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
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label={t('label_enable_editing')}/>
                        <TextField
                            fullWidth
                            required
                            error={contactNameError}
                            id='contact_name'
                            disabled={!isEditing}
                            label={t('label_contact_name')}
                            value={contactName}
                            onChange={functionUtils.handleSetInput(setContactName)}>
                        </TextField>
                        <TextField
                            fullWidth
                            required
                            error={contactPhoneNumberError}
                            id='contact_phone_number'
                            disabled={!isEditing}
                            label={t('label_contact_phone_number')}
                            value={contactPhoneNumber}
                            onChange={functionUtils.handleSetInput(setContactPhoneNumber)}>
                        </TextField>
                        <TextField
                            fullWidth
                            type="email"
                            id='contact_email'
                            disabled={!isEditing} label={t('label_contact_email')}
                            value={contactEmail}
                            onChange={functionUtils.handleSetInput(setContactEmail)}>
                        </TextField>
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            id='contact_addtInfo'
                            disabled={!isEditing}
                            label={t('label_additional_info')}
                            value={contactAddtInfo}
                            onChange={functionUtils.handleSetInput(setContactAddtInfo)}>
                        </TextField>
                        <Button disabled={!isEditing} onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
            <Fab onClick={handleOpenCreate}
                variant="text"
                style={{ position: 'absolute', bottom: 10, right: 10 }}
                size="medium"
                color="secondary">
                <AddIcon />
            </Fab>
        </div>
    );
};
