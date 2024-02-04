import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import functionUtils from '../utils/functionUtils.js'
import requester from '../apiRequester/Requester.js';
import localizedComponents from '../utils/localizedComponents.js'
import Webcam from "react-webcam";
import '../styles/App.css';

const videoConstraints = {
    width: 720,
    height: 360,
    facingMode: "user"
};

export function Patients() {
    const [t] = useTranslation();
    const dataGridLocales = localizedComponents.DatagridLocales();
    const patientEndpoint = 'patient';
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const [patientID, setPatientID] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientNickname, setPatientNickname] = useState('');
    const [patientBirthday, setPatientBirthday] = useState(functionUtils.getToday());
    const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
    const [patientAddress, setPatientAddress] = useState('');
    const [referenceContactName, setReferenceContactName] = useState('');
    const [referenceContactNumber, setReferenceContactNumber] = useState('');
    const [referenceDoctor, setReferenceDoctor] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [oldID, setOldID] = useState('');
    const [updateID, setUpdateID] = useState('');

    const [patientIDError, setPatientIDError] = useState(false);
    const [patientNameError, setPatientNameError] = useState(false);
    const [patientEmailError, setPatientEmailError] = useState(false);
    const [patientNicknameError, setPatientNicknameError] = useState(false);
    const [patientBirthdayError, setPatientBirthdayError] = useState(false);
    const [patientPhoneNumberError, setPatientPhoneNumberError] = useState(false);
    const [patientAddressError, setPatientAddressError] = useState(false);
    const [referenceContactNameError, setReferenceContactNameError] = useState(false);
    const [referenceContactNumberError, setReferenceContactNumberError] = useState(false);

    const [isCaptureEnable, setCaptureEnable] = useState(false);
    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setUrl(imageSrc);
        }
    }, [webcamRef]);

    const columns = [
        {
            field: '_id', headerName: t('title_patient_id'), width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.value)}>{params.value}</Link>
            )
        },
        { field: 'patient_name', headerName: t('title_patient_name'), width: 200 },
        { field: 'patient_email', headerName: t('title_patient_email'), width: 200 },
        { field: 'patient_nickname', headerName: t('title_patient_nickname'), width: 200 },
        { field: 'patient_birthday', headerName: t('title_patient_birthday'), width: 200 },
        { field: 'patient_phone_number', headerName: t('title_patient_phone_number'), width: 200 },
        { field: 'patient_address', headerName: t('title_patient_address'), width: 200 },
        { field: 'reference_contact_name', headerName: t('title_reference_contact_name'), width: 200 },
        { field: 'reference_contact_number', headerName: t('title_reference_contact_phone_number'), width: 200 },
        { field: 'reference_doctor', headerName: t('title_reference_doctor'), width: 200 },
        { field: 'additional_info', headerName: t('title_additional_info'), width: 200 },
        { field: 'old_id', headerName: t('title_old_id'), width: 200 },
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
        },
    ];

    async function handleOpenCreate() { setOpenCreate(true) };
    async function handleOpenUpdate(updatePatientID) {
        const patientInfo = await getPatient(updatePatientID);
        setPatientID(patientInfo._id);
        setPatientName(patientInfo.patient_name);
        setPatientEmail(patientInfo.patient_email);
        setPatientNickname(patientInfo.patient_nickname);
        setPatientBirthday(patientInfo.patient_birthday);
        setPatientPhoneNumber(patientInfo.patient_phone_number);
        setPatientAddress(patientInfo.patient_address);
        setReferenceContactName(patientInfo.reference_contact_name);
        setReferenceContactNumber(patientInfo.reference_contact_number);
        setReferenceDoctor(patientInfo.reference_doctor);
        setAdditionalInfo(patientInfo.additional_info);
        setOldID(patientInfo.old_id);
        setUpdateID(updatePatientID);
        setOpenUpdate(true);
    };

    async function handleClose() {
        setOpenCreate(false);
        setOpenUpdate(false);
        enableTextFields(false);
        cleanModalFields();
    };

    async function switchHandler(event) {
        enableTextFields(event.target.checked);
    };

    async function enableTextFields(checked) {
        setIsEditing(checked);
    };

    async function loadPatientsList() {
        try {
            const patients = await requester.requestGetList(patientEndpoint);
            setElements(patients);
            setIsLoaded(true);
        } catch (error) {
            setIsLoaded(true)
            console.log(error);
        };
    };

    async function getPatient(patientID) {
        try {
            const patient = await requester.requestGet(patientEndpoint, patientID);
            return patient;
        } catch (error) {
            console.log(error);
        };
    };

    async function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                _id: patientID,
                patient_name: patientName,
                patient_email: patientEmail,
                patient_nickname: patientNickname,
                patient_birthday: patientBirthday,
                patient_phone_number: patientPhoneNumber,
                patient_address: patientAddress,
                reference_contact_name: referenceContactName,
                reference_contact_number: referenceContactNumber,
                reference_doctor: referenceDoctor,
                additional_info: additionalInfo,
                old_id: oldID,
                patient_image: url,
            },
            filter: {},
        };
        if (openCreate) {
            if (referenceDoctor === '') delete requestBody.body.reference_doctor;
            if (additionalInfo === '') delete requestBody.body.additional_info;
            if (oldID === '') delete requestBody.body.old_id;
            await requester.requestInsert(patientEndpoint, JSON.stringify(requestBody));
        } else if (openUpdate) {
            if (url === null) delete requestBody.body.patient_image;
            requestBody.filter._id = updateID;
            await requester.requestUpdate(patientEndpoint, JSON.stringify(requestBody));
        }
        handleClose();
        loadPatientsList();
    };

    async function handleDelete(patientID) {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: patientID,
            }
        };
        await requester.requestDelete(patientEndpoint, JSON.stringify(requestBody));
        loadPatientsList();
    };

    function cleanModalFields() {
        setPatientID('');
        setPatientName('');
        setPatientEmail('');
        setPatientNickname('');
        setPatientBirthday(functionUtils.getToday());
        setPatientPhoneNumber('');
        setPatientAddress('');
        setReferenceContactName('');
        setReferenceContactNumber('');
        setReferenceDoctor('');
        setAdditionalInfo('');
        setOldID('');
        setUrl(null)
    };

    function validateRequiredFields() {
        let error = false;
        if (patientID === '') {
            setPatientIDError(true);
            return true;
        } else {
            setPatientIDError(false);
            error = false;
        }
        if (patientName === '') {
            setPatientNameError(true);
            return true;
        } else {
            setPatientNameError(false);
            error = false;
        }
        if (patientEmail === '') {
            setPatientEmailError(true);
            return true;
        } else {
            setPatientEmailError(false);
            error = false;
        }
        if (patientNickname === '') {
            setPatientNicknameError(true);
            return true;
        } else {
            setPatientNicknameError(false);
            error = false;
        }
        if (patientBirthday === '') {
            setPatientBirthdayError(true);
            return true;
        } else {
            setPatientBirthdayError(false);
            error = false;
        }
        if (patientPhoneNumber === '') {
            setPatientPhoneNumberError(true);
            return true;
        } else {
            setPatientPhoneNumberError(false);
            error = false;
        }
        if (patientAddress === '') {
            setPatientAddressError(true);
            return true;
        } else {
            setPatientAddressError(false);
            error = false;
        }
        if (referenceContactName === '') {
            setReferenceContactNameError(true);
            return true;
        } else {
            setReferenceContactNameError(false);
            error = false;
        }
        if (referenceContactNumber === '') {
            setReferenceContactNumberError(true);
            return true;
        } else {
            setReferenceContactNumberError(false);
            error = false;
        }
        return error;
    };

    useEffect(() => {
        loadPatientsList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', background: '#e0e0e0', padding: '1%', borderRadius: 10, marginTop: '2%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: 10, padding: 10 }}>
                <Button variant="h3" component="div"
                    style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', marginTop: 15, marginBottom: 15 }}>
                    {t('title_patient_list')}
                </Button>
                <Fab onClick={handleOpenCreate}
                    variant="text"
                    size="medium"
                    color="secondary"
                    style={{ borderRadius: '30%' }}>
                    <AddIcon />
                </Fab>
            </div>
            <div style={{ height: 600, width: '100%', background: 'white', borderRadius: 10, marginTop: 10, overflow: 'hidden' }}>
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
                aria-describedby="modal-modal-content"
                >
                <Box className='modal-box-big' sx={{ width: '80%', maxWidth: '800px' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t('title_add_new_patient')}
                    </Typography>

                    <FormGroup>
                    {/* Patient ID */}
                    <TextField
                        fullWidth
                        id='patient_id_input_create'
                        label={t('label_patient_id')}
                        value={patientID}
                        type="number"
                        error={patientIDError}
                        sx={{ width: '33%' }}
                        required
                        onChange={functionUtils.handleSetInput(setPatientID)}
                    />

                    {/* Patient Name, Email */}
                    <Grid container spacing={1}>
                        <Grid container item className='grid-modal'>
                        <TextField
                            id='patient_name_input_create'
                            label={t('label_patient_name')}
                            value={patientName}
                            type="text"
                            sx={{ width: '45%' }}
                            error={patientNameError}
                            required
                            onChange={functionUtils.handleSetInput(setPatientName)}
                        />
                        <TextField
                            id='patient_email_input_create'
                            label={t('label_patient_email')}
                            value={patientEmail}
                            type="email"
                            sx={{ width: '45%' }}
                            error={patientEmailError}
                            required
                            onChange={functionUtils.handleSetInput(setPatientEmail)}
                        />
                        </Grid>

                        {/* Patient Phone, Birthday */}
                        <Grid container item justifyContent="space-between">
                        <TextField
                            id='patient_nickname_input_create'
                            label={t('label_patient_nickname')}
                            value={patientNickname}
                            sx={{ width: '30%' }}
                            error={patientNicknameError}
                            required
                            onChange={functionUtils.handleSetInput(setPatientNickname)}
                        />
                        <TextField
                            id='patient_phone_number_input_create'
                            label={t('label_patient_phone_number')}
                            value={patientPhoneNumber}
                            type="number"
                            error={patientPhoneNumberError}
                            sx={{ width: '30%' }}
                            required
                            onChange={functionUtils.handleSetInput(setPatientPhoneNumber)}
                        />
                        <TextField
                            id="patient_birthday_input_create"
                            label={t('label_patient_birthday')}
                            type="date"
                            value={patientBirthday}
                            required
                            error={patientBirthdayError}
                            sx={{ width: '30%' }}
                            onChange={functionUtils.handleSetInput(setPatientBirthday)}
                            InputLabelProps={{ shrink: true, }}
                        />
                        </Grid>

                        {/* Patient Address */}
                        <Grid container item justifyContent="space-evenly">
                        <TextField
                            id='patient_address_input_create'
                            label={t('label_patient_address')}
                            value={patientAddress}
                            error={patientAddressError}
                            sx={{ width: '100%' }}
                            multiline
                            rows={2}
                            required
                            onChange={functionUtils.handleSetInput(setPatientAddress)}
                        />
                        </Grid>

                        {/* Reference Contact */}
                        <Grid container item justifyContent="space-between">
                        <TextField
                            id='reference_contact_name_input_create'
                            label={t('label_reference_contact_name')}
                            value={referenceContactName}
                            sx={{ width: '45%' }}
                            error={referenceContactNameError}
                            required
                            onChange={functionUtils.handleSetInput(setReferenceContactName)}
                        />
                        <TextField
                            id='reference_contact_number_input_create'
                            label={t('label_reference_contact_number')}
                            value={referenceContactNumber}
                            sx={{ width: '45%' }}
                            error={referenceContactNumberError}
                            required
                            onChange={functionUtils.handleSetInput(setReferenceContactNumber)}
                        />
                        </Grid>

                        {/* Reference Doctor, Old ID */}
                        <Grid container item justifyContent="space-between">
                        <TextField
                            id='reference_doctor_input_create'
                            label={t('label_reference_doctor')}
                            value={referenceDoctor}
                            sx={{ width: '45%' }}
                            onChange={functionUtils.handleSetInput(setReferenceDoctor)}
                        />
                        <TextField
                            id='old_id_input_create'
                            label={t('label_old_id')}
                            sx={{ width: '45%' }}
                            value={oldID}
                            onChange={functionUtils.handleSetInput(setOldID)}
                        />
                        </Grid>
                    </Grid>

                    <Grid container item justifyContent="space-between" alignItems="flex-start">
                    {/* Capture Enable */}
                    <div style={{ width: '100%', marginBottom: '16px' }}>
                        {isCaptureEnable || (
                        <Button onClick={() => setCaptureEnable(true)}>{t('button_enable_cam')}</Button>
                        )}
                        {isCaptureEnable && (
                        <>
                            <div>
                            <Button onClick={() => setCaptureEnable(false)}>{t('button_disable_cam')}</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Webcam
                                audio={false}
                                width={'100%'} 
                                height={240}    
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                            />
                            <Button onClick={capture} style={{ marginTop: '8px', width: '100%' }}>
                                {t('button_take_picture')}
                            </Button>
                            </div>
                        </>
                        )}
                    </div>

                    {/* Image Display */}
                    <div style={{ width: '100%' }}>
                        {url && (
                        <>
                            <Typography variant="h6" component="h2" style={{ marginBottom: '16px' }}>
                            {t('title_image_taken')}
                            </Typography>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div>
                                <img required src={url} alt="Screenshot" style={{ maxWidth: '100%', height: 'auto' }} />
                            </div>
                            <Button onClick={() => { setUrl(null); }} style={{ marginTop: '8px', width: '100%' }}>
                                {t('button_remove_image')}
                            </Button>
                            </div>
                        </>
                        )}
                    </div>
                    </Grid>

                    {/* Additional Info and Submit Button */}
                    <TextField
                        id='additional_info_input'
                        label={t('label_additional_info')}
                        multiline
                        rows={10}
                        value={additionalInfo}
                        onChange={functionUtils.handleSetInput(setAdditionalInfo)}
                    />
                    <Button onClick={handleSubmit}>{t('button_create')}</Button>
                    </FormGroup>
                </Box>
            </Modal>

            <Modal
                open={openUpdate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content" >
                <Box className='modal-box-big'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_update_patient')}
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label={t('label_enable_editing')} />
                        <TextField
                            fullWidth
                            id='patient_id_input_update'
                            label={t('label_patient_id')}
                            value={patientID}
                            type="number"
                            error={patientIDError}
                            sx={{ width: 220 }}
                            required
                            onChange={functionUtils.handleSetInput(setPatientID)}
                            disabled={!isEditing} />
                        <Grid container spacing={1}>
                            <Grid container item className='grid-modal'>
                                <TextField
                                    id='patient_name_input_update'
                                    label={t('label_patient_name')}
                                    value={patientName}
                                    type="text"
                                    sx={{ width: '45%' }}
                                    error={patientNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientName)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_email_input_update'
                                    label={t('label_patient_email')}
                                    value={patientEmail}
                                    type="email"
                                    sx={{ width: '45%' }}
                                    error={patientEmailError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientEmail)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-between">
                                <TextField
                                    id='patient_nickname_input_update'
                                    label={t('label_patient_nickname')}
                                    sx={{ width: '33%' }}
                                    value={patientNickname}
                                    error={patientNicknameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientNickname)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_phone_number_input_update'
                                    label={t('label_patient_phone_number')}
                                    value={patientPhoneNumber}
                                    error={patientPhoneNumberError}
                                    sx={{ width: '33%' }}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientPhoneNumber)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_birthday_input_update'
                                    label={t('label_patient_birthday')}
                                    type="date"
                                    value={patientBirthday}
                                    required
                                    error={patientBirthdayError}
                                    sx={{ width: '33%' }}
                                    onChange={functionUtils.handleSetInput(setPatientBirthday)}
                                    InputLabelProps={{ shrink: true, }}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_address_input_update'
                                    label={t('label_patient_address')}
                                    value={patientAddress}
                                    error={patientAddressError}
                                    sx={{ width: '100%' }}
                                    multiline
                                    rows={2}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientAddress)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-between">
                                <TextField
                                    id='reference_contact_name_input_update'
                                    label={t('label_reference_contact_name')}
                                    value={referenceContactName}
                                    sx={{ width: '45%' }}
                                    error={referenceContactNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactName)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='reference_contact_number_input_update'
                                    label={t('label_reference_contact_number')}
                                    value={referenceContactNumber}
                                    sx={{ width: '45%' }}
                                    error={referenceContactNumberError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactNumber)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-between">
                                <TextField
                                    id='reference_doctor_input_update'
                                    label={t('label_reference_doctor')}
                                    value={referenceDoctor}
                                    sx={{ width: '45%' }}
                                    onChange={functionUtils.handleSetInput(setReferenceDoctor)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='old_id_input_update'
                                    label={t('label_old_id')}
                                    value={oldID}
                                    sx={{ width: '45%' }}
                                    onChange={functionUtils.handleSetInput(setOldID)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='additional_info_input_update'
                                    label={t('label_additional_info')}
                                    value={additionalInfo}
                                    sx={{ width: '100%' }}
                                    multiline
                                    rows={10}
                                    onChange={functionUtils.handleSetInput(setAdditionalInfo)}
                                    disabled={!isEditing} />
                            </Grid>
                        </Grid>
                        <Button onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
        </div>
    );
};
