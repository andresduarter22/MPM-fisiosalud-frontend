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
import { FormGroup, TextField, FormControlLabel } from '@mui/material';
import patientListRequests from '../requests/patientListRequests.js';
import functionUtils from '../utils/functionUtils.js'
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

    const handleOpenCreate = () => setOpenCreate(true);
    const handleOpenUpdate = async (updatePatientID) => {
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
        setOpenUpdate(true);
    };

    const handleClose = () => {
        setOpenCreate(false);
        setOpenUpdate(false);
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

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setUrl(imageSrc);
        }
    }, [webcamRef]);

    const loadPatientsList = async () => {
        try {
            const patients = await patientListRequests.getPatientsList();
            setElements(patients);
            setIsLoaded(true);
        } catch (error) {
            setIsLoaded(true)
            console.log(error);
        };
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

    const getPatient = async (patientID) => {
        try {
            const patient = await patientListRequests.getPatient(patientID);
            return patient;
        } catch (error) {
            console.log(error);
        };
    };

    const handleDelete = async (patientID) => {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: patientID,
            }
        }
        await patientListRequests.deletePatient(JSON.stringify(requestBody));
        loadPatientsList();
    };

    const handleSubmit = async (event) => {
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
                patient_image: url,
            },
            filter: {}
        };
        if (referenceDoctor !== '') requestBody.body.reference_doctor = referenceDoctor;
        if (additionalInfo !== '') requestBody.body.additional_info = additionalInfo;
        if (oldID !== '') requestBody.body.old_id = oldID;
        if (openCreate) {
            await patientListRequests.insertPatient(JSON.stringify(requestBody));
            setOpenCreate(false);
        } else if (openUpdate) {
            requestBody.filter._id = patientID;
            console.log(requestBody);
            await patientListRequests.updatePatient(JSON.stringify(requestBody));
            enableTextFields(false);
            setOpenUpdate(false);
        }
        cleanModalFields();
        loadPatientsList();
    };

    useEffect(() => {
        loadPatientsList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_patient_list')}
                </Button>
                {/* <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_patient')} </Button> */}
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
                aria-describedby="modal-modal-content">
                <Box className='modal-box-big'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_add_new_patient')}
                    </Typography>
                    <FormGroup>
                        <TextField
                            fullWidth
                            id='patient_id_input_create'
                            label={t('label_patient_id')}
                            value={patientID}
                            type="number"
                            error={patientIDError}
                            sx={{ width: 220 }}
                            required
                            onChange={functionUtils.handleSetInput(setPatientID)} />
                        <Grid container spacing={1}>
                            <Grid container item className='grid-modal'>
                                <TextField
                                    id='patient_name_input'
                                    label={t('label_patient_name')}
                                    value={patientName}
                                    type="text"
                                    sx={{ width: 550 }}
                                    error={patientNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientName)} />
                                <TextField
                                    id='patient_email_input'
                                    label={t('label_patient_email')}
                                    value={patientEmail}
                                    type="email"
                                    sx={{ width: 550 }}
                                    error={patientEmailError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientEmail)} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_nickname_input'
                                    label={t('label_patient_nickname')}
                                    value={patientNickname}
                                    sx={{ width: 220 }}
                                    error={patientNicknameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientNickname)} />
                                <TextField id='patient_phone_number_input'
                                    label={t('label_patient_phone_number')}
                                    value={patientPhoneNumber}
                                    type="number"
                                    error={patientPhoneNumberError}
                                    sx={{ width: 220 }}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientPhoneNumber)} />
                                <TextField
                                    id="patient_birthday_input"
                                    label={t('label_patient_birthday')}
                                    type="date"
                                    value={patientBirthday}
                                    required
                                    error={patientBirthdayError}
                                    sx={{ width: 220 }}
                                    onChange={functionUtils.handleSetInput(setPatientBirthday)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_address_input'
                                    label={t('label_patient_address')}
                                    value={patientAddress}
                                    error={patientAddressError}
                                    multiline
                                    rows={2}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientAddress)} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='reference_contact_name_input'
                                    label={t('label_reference_contact_name')}
                                    value={referenceContactName}
                                    sx={{ width: 220 }}
                                    error={referenceContactNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactName)} />
                                <TextField
                                    id='reference_contact_number_input'
                                    label={t('label_reference_contact_number')}
                                    value={referenceContactNumber}
                                    sx={{ width: 220 }}
                                    error={referenceContactNumberError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactNumber)} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='reference_doctor_input'
                                    label={t('label_reference_doctor')}
                                    value={referenceDoctor}
                                    sx={{ width: 220 }}
                                    onChange={functionUtils.handleSetInput(setReferenceDoctor)} />
                                <TextField
                                    id='old_id_input'
                                    label={t('label_old_id')}
                                    sx={{ width: 220 }}
                                    value={oldID}
                                    onChange={functionUtils.handleSetInput(setOldID)} />
                            </Grid>
                        </Grid>

                        {isCaptureEnable || (
                            <Button onClick={() => setCaptureEnable(true)}>Enable cam</Button>
                        )}
                        {isCaptureEnable && (
                            <>
                                <div>
                                    <Button onClick={() => setCaptureEnable(false)}>Disable cam</Button>
                                </div>
                                <div>
                                    <Webcam
                                        audio={false}
                                        width={540}
                                        height={360}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                    />
                                </div>
                                <Button onClick={capture}>Take picture</Button>
                            </>
                        )}
                        {url && (
                            <>
                                <div>
                                    <Button
                                        onClick={() => {
                                            setUrl(null);
                                        }}
                                    >
                                        Delete Image
                                    </Button>
                                </div>
                                <div>
                                    <img src={url} alt="Screenshot" />
                                </div>
                            </>
                        )}
                        <TextField
                            id='additional_info_input'
                            label={t('label_additional_info')}
                            multiline
                            rows={10}
                            value={additionalInfo}
                            onChange={functionUtils.handleSetInput(setAdditionalInfo)} />
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
                        <Grid container spacing={1}>
                            <Grid container item className='grid-modal'>
                                <TextField
                                    id='patient_id_input_update'
                                    label={t('label_patient_id')}
                                    value={patientID} error={patientIDError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientID)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_name_input_update'
                                    label={t('label_patient_name')}
                                    value={patientName}
                                    error={patientNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientName)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_email_input_update'
                                    label={t('label_patient_email')}
                                    value={patientEmail}
                                    error={patientEmailError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientEmail)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_nickname_input_update'
                                    label={t('label_patient_nickname')}
                                    type="text"
                                    value={patientNickname}
                                    error={patientNicknameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientNickname)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_birthday_input_update'
                                    label={t('label_patient_birthday')}
                                    value={patientBirthday}
                                    error={patientBirthdayError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientBirthday)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='patient_phone_number_input_update'
                                    label={t('label_patient_phone_number')}
                                    value={patientPhoneNumber}
                                    error={patientPhoneNumberError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientPhoneNumber)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='patient_address_input_update'
                                    label={t('label_patient_address')}
                                    value={patientAddress}
                                    error={patientAddressError}
                                    required
                                    onChange={functionUtils.handleSetInput(setPatientAddress)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='reference_contact_name_input_update'
                                    label={t('label_reference_contact_name')}
                                    value={referenceContactName}
                                    error={referenceContactNameError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactName)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='reference_contact_number_input_update'
                                    label={t('label_reference_contact_number')}
                                    value={referenceContactNumber}
                                    error={referenceContactNumberError}
                                    required
                                    onChange={functionUtils.handleSetInput(setReferenceContactNumber)}
                                    disabled={!isEditing} />
                            </Grid>
                            <Grid container item justifyContent="space-evenly">
                                <TextField
                                    id='reference_doctor_input_update'
                                    label={t('label_reference_doctor')}
                                    value={referenceDoctor}
                                    onChange={functionUtils.handleSetInput(setReferenceDoctor)}
                                    disabled={!isEditing} />
                                <TextField
                                    id='additional_info_input_update'
                                    label={t('label_additional_info')}
                                    value={additionalInfo}
                                    onChange={functionUtils.handleSetInput(setAdditionalInfo)}
                                    disabled={!isEditing} />
                            </Grid>
                        </Grid>
                        <TextField
                            id='old_id_input_update'
                            label={t('label_old_id')}
                            value={oldID}
                            onChange={functionUtils.handleSetInput(setOldID)}
                            disabled={!isEditing} />
                        <Button onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
            <Fab onClick={handleOpenCreate} variant="text" style={{ position: 'absolute', bottom: 10, right:10 }} size="medium" color="secondary">
                    <AddIcon />
            </Fab>
        </div>
    );
};
