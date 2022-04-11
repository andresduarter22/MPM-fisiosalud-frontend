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
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import { FormGroup, TextField, FormControlLabel } from '@mui/material';
import staffListRequests from '../requests/staffRequests.js'
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/App.css';

export function Staff() {
    const [t] = useTranslation();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const [staffID, setStaffID] = useState('');
    const [staffName, setStaffName] = useState('');
    const [staffPhoneNumber, setStaffPhoneNumber] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffRole, setStaffRole] = useState('admin');
    const [staffRoleOptions] = useState([
        { value: 'admin', label: t('label_staff_role_admin') },
        { value: 'staff', label: t('label_staff_role_staff') },
        { value: 'receptionist', label: t('label_staff_role_receptionist') },
    ]);

    const handleOpenCreate = () => setOpenCreate(true);

    const handleOpenUpdate = async (areaID) => {
        const areaInfo = await getStaff(areaID);
        setStaffID(areaInfo._id);
        setStaffName(areaInfo.staff_name);
        setStaffPhoneNumber(areaInfo.staff_phone_number);
        setStaffEmail(areaInfo.staff_email);
        setStaffRole(areaInfo.staff_role);
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
                    // onClick={duplicateUser(params.id)}
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
            const staffList = await staffListRequests.getStaffList();
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
        setStaffEmail('');
        setStaffRole('admin');
    };

    const handleDelete = async (id) => {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: id,
            }
        }
        await staffListRequests.deleteStaff(requestBody);
        loadStaffList();
    };

    const getStaff = async (id) => {
        return await staffListRequests.getStaff(id);
    };

    const handleSubmit = async () => {
        const bodyValue = {
            body: {
                _id: staffID,
                staff_name: staffName,
                staff_phone_number: staffPhoneNumber,
                staff_email: staffEmail,
                staff_role: staffRole,
            },
        };
        if (openCreate) {
            console.log(bodyValue)
            await staffListRequests.insertStaff(bodyValue);
        } else if (openUpdate) {
            bodyValue.filter._id = staffID;
            console.log(bodyValue)
            await staffListRequests.updateStaff(bodyValue);
        }
        loadStaffList();
        handleClose();
    };

    useEffect(() => {
        loadStaffList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }}>
                    {t('title_staff_list')}
                </Button>
                <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_staff')} </Button>
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
                <Modal
                    open={openCreate}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-content" >
                    <Box className='modal-box'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create Staff Member
                        </Typography>
                        <FormGroup>
                            <TextField id="staff_id_input" label="Staff ID" value={staffID}
                                onChange={functionUtils.handleSetInput(setStaffID)} />
                            <TextField id="staff_name_input" label="Staff Name" value={staffName}
                                onChange={functionUtils.handleSetInput(setStaffName)} />
                            <TextField id="staff_phone_number_input" label="Staff Phone Number" value={staffPhoneNumber}
                                onChange={functionUtils.handleSetInput(setStaffPhoneNumber)} />
                            <TextField id="staff_email_input" label="Staff Email" value={staffEmail}
                                onChange={functionUtils.handleSetInput(setStaffEmail)} />
                            <FormControl fullWidth>
                                <InputLabel id="staff_role_label">Role</InputLabel>
                                <Select
                                    labelId="staff_role_label"
                                    label="Role"
                                    id="staff_role_select"
                                    value={staffRole}
                                    onChange={functionUtils.handleSetInput(setStaffRole)}
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
                            Update Staff Member
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={switchHandler} />} label="Enable editing" />
                            <TextField id="staff_id_input" label="Staff ID" value={staffID} disabled={!isEditing}
                                onChange={functionUtils.handleSetInput(setStaffID)} />
                            <TextField id="staff_name_input" label="Staff Name" value={staffName} disabled={!isEditing}
                                onChange={functionUtils.handleSetInput(setStaffName)} />
                            <TextField id="staff_phone_number_input" label="Staff Phone Number" value={staffPhoneNumber} disabled={!isEditing}
                                onChange={functionUtils.handleSetInput(setStaffPhoneNumber)} />
                            <TextField id="staff_email_input" label="Staff Email" value={staffEmail} disabled={!isEditing}
                                onChange={functionUtils.handleSetInput(setStaffEmail)} />
                            <FormControl fullWidth>
                                <InputLabel id="staff_role_label">Role</InputLabel>
                                <Select
                                    labelId="staff_role_label"
                                    label="Role"
                                    id="staff_role_select"
                                    value={staffRole}
                                    onChange={functionUtils.handleSetInput(setStaffRole)}
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
                                    {t('button_update')}
                                </Button>
                            </div>
                        </FormGroup>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};
//                         <TextField disabled={!areaNameEditable} id='area_name' onChange={functionUtils.handleSetInput(setAreaName)} value={areaName} label="Area Name" />
//                         <TextField disabled={!areaCapacityEditable} id='area_capacity' type="number" onChange={functionUtils.handleSetInput(setAreaCapacity)} label="Area Maximun Capacity" value={areaCapacity} />
//                         <FormControlLabel control={
//                             <Checkbox disabled={!areaAvialableEditable} id='area_avialable' onChange={handleCheckBoxChange} checked={areaAvialable} />
//                         } label="Area Avialable" />
//                         <Button disabled={!saveButtonEditable} onClick={updateArea}>Update</Button>
//                     </FormGroup>
//                 </Box>
//             </Modal>
//             </div>
//         </div>
//     );
// };
