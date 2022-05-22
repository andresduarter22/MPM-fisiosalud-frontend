import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import { FormGroup, TextField, FormControlLabel } from '@mui/material';
import requester from '../apiRequester/Requester.js';
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/App.css';

export function Staff() {
    const [t] = useTranslation();
    const staffEndpoint = "staff";
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const [staffIDError, setStaffIDError] = useState(false);
    const [staffNameError, setStaffNameError] = useState(false);
    const [staffEmailError, setStaffEmailError] = useState(false);
    const [staffPhoneError, setStaffPhoneError] = useState(false);
    const [staffRoleError, setStaffRoleError] = useState(false);
    const [staffPasswordError, setStaffPasswordError] = useState(false);

    const [staffID, setStaffID] = useState('');
    const [staffName, setStaffName] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [staffPhoneNumber, setStaffPhoneNumber] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [updateID, setUpdateID] = useState('');
    const [staffRole, setStaffRole] = useState('');
    const [staffRoleOptions] = useState([
        { value: 'admin', label: t('label_staff_role_admin') },
        { value: 'staff', label: t('label_staff_role_staff') },
        { value: 'receptionist', label: t('label_staff_role_receptionist') },
    ]);

    const handleOpenCreate = () => setOpenCreate(true);

    const handleOpenUpdate = async (updateStaffID) => {
        const staffInfo = await getStaff(updateStaffID);
        setStaffID(staffInfo._id);
        setUpdateID(updateStaffID);
        setStaffName(staffInfo.staff_name);
        setStaffPhoneNumber(staffInfo.staff_phone_number);
        setStaffEmail(staffInfo.staff_email);
        setStaffRole(staffInfo.staff_role);
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

    const enableTextFields = (checked) => {
        setIsEditing(checked);
    };

    const dataGridLocales = localizedComponents.DatagridLocales();

    const columns = [
        {
            field: '_id', headerName: 'ID', width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.value)}>{params.value}</Link>
            )
        },
        { field: 'staff_name', headerName: 'Name', width: 200 },
        { field: 'staff_phone_number', headerName: 'Phone Number', width: 200 },
        { field: 'staff_email', headerName: 'Email', width: 200 },
        { field: 'staff_role', headerName: 'Role', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label={t('button_update')}
                    onClick={() => { handleOpenUpdate(params.id) }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => { handleDelete(params.id) }}
                    showInMenu
                />,
            ],
        },
    ];

    const loadStaffList = async () => {
        try {
            const staffList = await requester.requestGetList(staffEndpoint);
            setElements(staffList)
            setIsLoaded(true)
        } catch (error) {
            setIsLoaded(true)
            console.log(error)
        };
    };

    function cleanModalFields() {
        setStaffID('');
        setStaffName('');
        setStaffPhoneNumber('');
        setStaffPassword('');
        setStaffEmail('');
        setStaffRole('');
    };

    function validateRequiredFields() {
        let error = false;
        if (staffID === '') {
            setStaffIDError(true);
            return true;
        } else {
            setStaffIDError(false);
            error = false;
        }
        if (staffName === '') {
            setStaffNameError(true);
            return true;
        } else {
            setStaffNameError(false);
            error = false;
        }
        if (staffPhoneNumber === '') {
            setStaffPhoneError(true);
            return true;
        } else {
            setStaffPhoneError(false);
            error = false;
        }
        if (staffEmail === '') {
            setStaffEmailError(true);
            return true;
        } else {
            setStaffEmailError(false);
            error = false;
        }
        if (staffRole === '') {
            setStaffRoleError(true);
            return true;
        } else {
            setStaffRoleError(false);
            error = false;
        }
        if (staffPassword === '') {
            setStaffPasswordError(true);
            return true;
        } else {
            setStaffPasswordError(false);
            error = false;
        }
        return error;
    };

    const handleDelete = async (id) => {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: id,
            }
        }
        await requester.requestDelete(staffEndpoint, JSON.stringify(requestBody));
        loadStaffList();
    };

    const getStaff = async (id) => {
        return await requester.requestGet(staffEndpoint, id);
    };

    const handleSubmit = async () => {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                _id: staffID,
                staff_name: staffName,
                staff_password: staffPassword,
                staff_phone_number: staffPhoneNumber,
                staff_email: staffEmail,
                staff_role: staffRole,
            },
            filter: {}
        };
        if (openCreate) {
            await requester.requestInsert(staffEndpoint, JSON.stringify(requestBody));
        } else if (openUpdate) {
            requestBody.filter._id = updateID;
            await requester.requestUpdate(staffEndpoint, JSON.stringify(requestBody));
        }
        handleClose();
        loadStaffList();
    };

    useEffect(() => {
        loadStaffList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_staff_list')}
                </Button>
                {/* <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_staff')} </Button> */}
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
                <Modal
                    open={openCreate}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-content" >
                    <Box className='modal-box'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('title_create_staff_member')}
                        </Typography>
                        <FormGroup>
                            {/* TODO: fix translations */}
                            <TextField id="staff_id_input" label="Staff ID" value={staffID} error={staffIDError} required
                                onChange={functionUtils.handleSetInput(setStaffID)} />
                            <TextField id="staff_name_input" label="Staff Name" value={staffName} error={staffNameError} required
                                onChange={functionUtils.handleSetInput(setStaffName)} />
                            <TextField id="staff_password_input" label="Staff Password" type="password" value={staffPassword} error={staffPasswordError} required
                                onChange={functionUtils.handleSetInput(setStaffPassword)} />
                            <TextField id="staff_phone_number_input" label="Staff Phone Number" value={staffPhoneNumber} error={staffPhoneError} required
                                onChange={functionUtils.handleSetInput(setStaffPhoneNumber)} />
                            <TextField id="staff_email_input" label="Staff Email" value={staffEmail} error={staffEmailError} required
                                onChange={functionUtils.handleSetInput(setStaffEmail)} />
                            <FormControl fullWidth>
                                <InputLabel id="staff_role_label" required>Role</InputLabel>
                                <Select
                                    labelId="staff_role_label"
                                    label="Role"
                                    id="staff_role_select"
                                    value={staffRole}
                                    onChange={functionUtils.handleSetInput(setStaffRole)}
                                    error={staffRoleError}
                                    required
                                >
                                    {staffRoleOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div id="button_update" style={{ marginTop: 15, float: 'right' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    {t('button_create')}
                                </Button>
                            </div>
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
                            {t('title_update_staff_member')}
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={switchHandler} />} label="Enable editing" />
                            <TextField id="staff_id_input" label="Staff ID" value={staffID} disabled={!isEditing} error={staffIDError}
                                onChange={functionUtils.handleSetInput(setStaffID)} />
                            <TextField id="staff_name_input" label="Staff Name" value={staffName} disabled={!isEditing} error={staffNameError}
                                onChange={functionUtils.handleSetInput(setStaffName)} />
                            <TextField id="staff_password_input" label="Staff Password" type="password" value={staffPassword} error={staffPasswordError} required
                                onChange={functionUtils.handleSetInput(setStaffPassword)} />
                            <TextField id="staff_phone_number_input" label="Staff Phone Number" value={staffPhoneNumber} disabled={!isEditing} error={staffPhoneError}
                                onChange={functionUtils.handleSetInput(setStaffPhoneNumber)} />
                            <TextField id="staff_email_input" label="Staff Email" value={staffEmail} disabled={!isEditing} error={staffEmailError}
                                onChange={functionUtils.handleSetInput(setStaffEmail)} />
                            <FormControl fullWidth>
                                <InputLabel id="staff_role_label" required>Role</InputLabel>
                                <Select
                                    labelId="staff_role_label"
                                    label="Role"
                                    id="staff_role_select"
                                    value={staffRole}
                                    onChange={functionUtils.handleSetInput(setStaffRole)}
                                    error={staffRoleError}
                                    required
                                >
                                    {staffRoleOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div id="button_update" style={{ marginTop: 15, float: 'right' }}>
                                <Button onClick={handleSubmit}>{t('button_update')}</Button>
                            </div>
                        </FormGroup>
                    </Box>
                </Modal>
                <Fab onClick={handleOpenCreate} variant="text" style={{ position: 'absolute', bottom: 10, right:10 }} size="medium" color="secondary">
                    <AddIcon />
            </Fab>
            </div>
        </div>
    );
};
