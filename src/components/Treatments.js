// create treatments list with all treatments and a modal to see all therapies for a treatment
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import requester from '../apiRequester/Requester.js';
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/App.css';

export function TreatmentsList() {
    const [t] = useTranslation();
    const dataGridLocales = localizedComponents.DatagridLocales();
    const treatmentEndpoint = 'treatment';
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openThreapiesList, setOpenThreapiesList] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [updateTreatmentID, setUpdateTreatmentID] = useState('');
    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [patientID, setPatientID] = useState('');
    const [patientName, setPatientName] = useState('');
    const [treatmentBasicInfo, setTreatmentBasicInfo] = useState('');
    const [treatmentAdditInfo, setTreatmentAdditInfo] = useState('');
    const [therapiesList, setTherapiesList] = useState([]);

    const [treatmentTitleError, setTreatmentTitleError] = useState(false);
    const [patientIDError, setPatientIDError] = useState(false);
    const [patientNameError, setPatientnameError] = useState(false);
    const [treatmentBasicInfoError, setTreatmentBasicInfoError] = useState(false);

    const columns = [
        {
            field: 'title', headerName: t('title_treatment_name'), width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.id)}>{params.value}</Link>
            )
        },
        {
            field: 'patitent_info', headerName: t('title_patient_name'), width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.id)}>{params.value[1]}</Link>
            )
        },
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
                    icon={<FormatListBulletedIcon />}
                    label={t('button_open_therapies_list')}
                    onClick={() =>  handleOpenTherapiesList(params.id) }
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => { handleDelete(params.id) }}
                    showInMenu
                />,
            ],
        }
    ];

    const therapiesColumns = [
        {
            field: 'title', headerName: t('title_therapy_name'), width: 200
        },
        {
            field: 'therapy_status', headerName: t('title_therapy_status'), width: 200
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => { handleDelete(params.id) }}
                    showInMenu
                />,
            ],
        }
    ];

    async function handleOpenTherapiesList(treatmentID) {
        console.log("Therapies", treatmentID);
        const treatmentInfo = await getTreatment(treatmentID);
        console.log(openThreapiesList);
        console.log("Info: ", treatmentInfo.therapies);
        setTherapiesList(treatmentInfo.therapies);
        // TODO: get therapies list for treatment
        // setTherapiesList([{_id: 1, title: "test"}]);
        setOpenThreapiesList(true);
    };

    async function handleOpenUpdate(treatmentID) {
        const treatmentInfo = await getTreatment(treatmentID);
        console.log("patient: ", treatmentInfo.patitent_info);
        setUpdateTreatmentID(treatmentID);
        setTreatmentTitle(treatmentInfo.title);
        setPatientID(treatmentInfo.patitent_info[0]);
        setPatientName(treatmentInfo.patitent_info[1]);
        setTreatmentBasicInfo(treatmentInfo.basic_info);
        // setTherapiesList(treatmentInfo.therapies);
        setTreatmentAdditInfo(treatmentInfo.additional_info);
        setOpenUpdate(true);
    };

    async function handleClose() {
        setOpenUpdate(false);
        setOpenThreapiesList(false);
        enableTextFields(false);
        cleanModalFields();
    };

    async function switchHandler(event) {
        enableTextFields(event.target.checked);
    };

    async function getTreatment(itemID) {
        try {
            const treatment = await requester.requestGet(treatmentEndpoint, itemID);
            return treatment;
        } catch (error) {
            console.log(error);
        };
    };

    async function loadTreatmentsList() {
        try {
            const treatmentsList = await requester.requestGetList(treatmentEndpoint);
            console.log("treatments", treatmentsList);
            Promise.all(treatmentsList.map(async (treatment) => {
                const therapiesCount = treatment.therapies.length;
                treatment.therapiesCount = therapiesCount;
            }));
            // console.log("trerapies count:", treatmentsList[0].therapiesCount);
            setElements(treatmentsList)
            setIsLoaded(true)
        } catch (error) {
            setIsLoaded(true)
            console.log(error)
        };
    };

    async function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                title: treatmentTitle,
                patitent_id: [patientID, patientName],
                basic_info: treatmentBasicInfo
            },
            filter: {
                _id: updateTreatmentID
            }
        };
        if (treatmentAdditInfo !== '') requestBody.body.additional_info = treatmentAdditInfo;
        requester.requestUpdate(treatmentEndpoint, JSON.stringify(requestBody));
        setOpenUpdate(false);
        handleClose();
        loadTreatmentsList();
    };

    async function handleDelete(id) {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: id,
            }
        }
        requester.requestDelete(treatmentEndpoint, JSON.stringify(requestBody));
        loadTreatmentsList();
    };

    async function cleanModalFields() {
        setTreatmentTitle('');
        setPatientID('');
        setTreatmentBasicInfo('');
        setTreatmentAdditInfo('');
        // setTherapiesList([]);
    };

    async function enableTextFields(checked) {
        setIsEditing(checked);
    };

    function validateRequiredFields() {
        let error = false;
        if (treatmentTitle === '') {
            setTreatmentTitleError(true);
            return true;
        } else {
            setTreatmentTitleError(false);
            error = false;
        }
        if (patientID === '') {
            setPatientIDError(true);
            return true;
        } else {
            setPatientIDError(false);
            error = false;
        }
        if (treatmentBasicInfo === '') {
            setTreatmentBasicInfoError(true);
            return true;
        } else {
            setTreatmentBasicInfoError(false);
            error = false;
        }
        if (patientName === '') {
            setPatientnameError(true);
            return true;
        } else {
            setPatientnameError(false);
            error = false;
        }
        return error;
    };

    useEffect(() => {
        loadTreatmentsList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div"
                    style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_treatments_list')}
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
            // TODO: check locales
                open={openUpdate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content">
                <Box className='modal-box'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_update_treatment')}
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label={t('label_enable_editing')} />
                        <TextField
                            id="tretment_title_input"
                            label={t('label_treatment_title')}
                            value={treatmentTitle}
                            error={treatmentTitleError}
                            required
                            onChange={functionUtils.handleSetInput(setTreatmentTitle)}
                            disabled={!isEditing} />
                        <TextField
                            id="basic_info_input"
                            label={t('label_basic_info')}
                            value={treatmentBasicInfo}
                            error={treatmentBasicInfoError}
                            required
                            multiline
                            rows={5}
                            onChange={functionUtils.handleSetInput(setTreatmentBasicInfo)}
                            disabled={!isEditing} />
                        <Grid container item justifyContent="space-between">
                            <TextField
                                id="patient_name_input"
                                label={t('label_patient_name')}
                                value={patientName}
                                error={patientNameError}
                                required
                                sx={{ width: '45%' }}
                                onChange={functionUtils.handleSetInput(setPatientName)}
                                disabled={!isEditing} />

                            <TextField
                                id="patient_id_input"
                                label={t('label_patient_id')}
                                value={patientID}
                                error={patientIDError}
                                required
                                sx={{ width: '45%' }}
                                onChange={functionUtils.handleSetInput(setPatientID)}
                                disabled={!isEditing} />
                        </Grid>
                        <TextField
                            id="addit_info_input"
                            label={t('label_addit_info')}
                            value={treatmentAdditInfo}
                            multiline
                            rows={5}
                            onChange={functionUtils.handleSetInput(setTreatmentAdditInfo)}
                            disabled={!isEditing} />
                    </FormGroup>
                    <Button disabled={!isEditing} onClick={handleSubmit}>{t('button_update')}</Button>
                </Box>
            </Modal>
            <Modal
                open={openThreapiesList}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content">
                <Box className='modal-box-big'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_therapies_list')}
                    </Typography>
                    <DataGrid
                        rows={therapiesList}
                        columns={therapiesColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row._id}
                        localeText={dataGridLocales}
                    />
                </Box>
            </Modal>
        </div>
    );
};