import { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import '../styles/App.css';
import { Scheduler } from "@aldabil/react-scheduler";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import requester from '../apiRequester/Requester.js';
import calendarProps from '../utils/calendarProps.js';
import functionUtils from '../utils/functionUtils.js';
import Webcam from "react-webcam";

export function Calendar() {
    const [t] = useTranslation();
    const therapyEnpoint = "therapy";
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [therapiesList, setTherapiesList] = useState([]);

    const loadTherapies = async () => {
        try {
            const therapies = await requester.requestGetList(therapyEnpoint);
            const events = [];
            await Promise.all(therapies.map(async (therapy) => {
                const startDate = new Date(therapy.date + "T" + therapy.time);
                const endDate = new Date(functionUtils.calculateEndHour(therapy.date + "T" + therapy.time, therapy.duration));
                if (therapy.therapy_status === "open") {
                    const event = {
                        event_id: therapy._id,
                        start: startDate,
                        end: endDate,
                        title: "Therapy: " + therapy.title
                    };
                    events.push(event);
                }
            }));
            setTherapiesList(events);
        } catch (error) {
            console.log(error);
        };
    };

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    const handleClose = async () => {
        const fetchTherapies = async () => {
            await loadTherapies();
        };
        setOpenCreate(false);
        cleanModalFields();
        fetchTherapies();
        setIsLoaded(true);
    };

    function cleanModalFields() { };

    useEffect(() => {
        const fetchTherapies = async () => {
            await loadTherapies();
        };
        fetchTherapies();
        setIsLoaded(true);
    }, []);

    if (!isLoaded) return <div>Loading...</div>;


    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }}>
                    {t('title_calendar')}
                </Button>
                {/* <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }} onClick={() => { handleOpenValidateFace() }}>
                    Validate Face
                </Button> */}
                <Button onClick={() => { handleOpenCreate() }} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_treatment')} </Button>
            </div>
            <div style={{ height: '100%', width: '100%', background: 'white' }}>
                <Scheduler
                    customEditor={(scheduler) => <CustomEditor t={t} scheduler={scheduler} setIsLoaded={setIsLoaded} handleClose={handleClose} />}
                    viewerExtraComponent={(fields, event) => <CustomViewer
                        fields={fields}
                        event={event}
                        loadTherapies={loadTherapies}
                    />}
                    events={therapiesList}
                    month={calendarProps.month}
                    week={calendarProps.week}
                    day={calendarProps.day}
                />
                <div id='calendar'></div>
            </div>
            <Modal
                open={openCreate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                title={t('title_add_new_treatment')}
                footer="Footer"
                aria-describedby="modal-modal-content">
                <Box className='modal-box-big'>
                    <CreateTreatment t={t} setIsLoaded={setIsLoaded} handleClose={handleClose} />
                </Box>
            </Modal>
        </div >
    )
};

function CustomEditor({ scheduler, t, setIsLoaded, handleClose }) {
    return (
        <Box className="modal-alt-box-big">
            <CreateTreatment t={t} setIsLoaded={setIsLoaded} handleClose={() => { handleClose(); scheduler.close(); }} />
        </Box>
    );
};

function ValidateWithCamera({ therapyId }) {
    const [t] = useTranslation();
    const therapyEnpoint = "therapy";
    const patientEndpoint = "patient";
    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [imageValidated, setImageValidated] = useState("Not validated");
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setUrl(imageSrc);
        }
    }, [webcamRef]);
    const handleValidateFace = async (therapyId) => {
        const therapyBody = {
            body: {
                therapy_status: "closed",
                action: "validate_face",
                patient_image: url,
            },
            filter: { _id: therapyId }
        };
        const response = await requester.requestUpdate(therapyEnpoint, JSON.stringify(therapyBody))
        if (response.result) {
            const patientInfo = await requester.requestGet(patientEndpoint, response.id);
            setImageValidated(`Welcome ${patientInfo.patient_name}!`);
        } else {
            setImageValidated(response.message);
        }
    };

    const videoConstraints = {
        width: 720,
        height: 360,
        facingMode: "user"
    };


    return (<Box className='modal-box-big'>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('title_update_patient')}
        </Typography>
        <Typography id="modal-modal-content">
            ID: {therapyId}
        </Typography>
        <FormGroup>
            {(
                <>
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
                            {/* TODO modificar texto */}
                            Delete Image
                        </Button>
                    </div>
                    <div>
                        <img src={url} alt="Screenshot" />
                    </div>
                </>
            )}
            {/* TODO modificar texto */}
            <Button onClick={() => handleValidateFace(therapyId)}>Validate Patient's Face</Button>
        </FormGroup>
        <Typography> {imageValidated}</Typography>
    </Box>);
};

function CustomViewer({ event, loadTherapies }) {
    // TODO: beutify this component xD
    const [t] = useTranslation();
    const [faceValidation, setFaceValidation] = useState(false);
    return (
        <>
            <Typography variant="h6" component="h2">
                {event.title}
            </Typography>
            <Typography variant="body1" component="p">
                {t('label_start')}: {event.start.toString()}
            </Typography>
            <Typography variant="body1" component="p">
                {t('label_end')}: {event.end.toString()}
            </Typography>
            <Button onClick={() => setFaceValidation(!faceValidation)}>
                {t('label_toggle_validation_type')}
            </Button>
            <PatientValidation
                faceValidation={faceValidation}
                therapy_id={event.event_id}
                loadTherapies={loadTherapies}
            />
        </>
    );
};

function PatientValidation({ faceValidation, therapy_id, loadTherapies}) {
    const [t] = useTranslation();
    const [patientID, setPatientID] = useState('');
    const [openValidateFace, setOpenValidateFace] = useState(false);
    async function handleOpenValidateFace() { setOpenValidateFace(true) };
    const handleClose = async () => {
        const fetchTherapies = async () => {
            await loadTherapies();
        };
        fetchTherapies();
        // setIsLoaded(true);
        setOpenValidateFace(false);
    };

    const handleValidateID = async () => {
        const therapyBody = {
            body: {
                therapy_status: "closed",
                action: "validate_id",
                patient_id: patientID,
            },
            filter: { _id: therapy_id }
        };
        const response = await requester.requestUpdate('therapy', JSON.stringify(therapyBody));
        handleClose();
    };

    if (faceValidation) {
        return (
            // TODO: open this modal when the user clicks on the button
        <>
            <Typography variant="h2" component="p">
                <Button onClick={async() => { await handleOpenValidateFace() }}>
                    {t('label_open_camera')}
                </Button>
            </Typography>
            <Modal
                open={openValidateFace}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content" >
                <ValidateWithCamera therapyId={therapy_id} />
            </Modal>
        </>
        );
    } else {
        return (
            <>
                <Typography variant="h2" component="p">
                    {/* TODO modificar texto */}
                    {t('title_validation_by_id')}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            id="patient_id_input"
                            label={t('label_patient_id')}
                            onChange={functionUtils.handleSetInput(setPatientID)}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            sx={{ width: '90%' }}
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            sx={{ width: '10%' }}
                            onClick={handleValidateID}
                        >
                            {t('label_validate_patient')}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }
};

function CreateTreatment({ t, setIsLoaded, handleClose }) {
    const patientEndpoint = 'patient';
    const workingAreasEndpoint = 'workingArea';
    const therapyEnpoint = "therapy";
    const treatmentEnpoint = "treatment";
    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [treatmentBasicInfo, setTreatmentBasicInfo] = useState('');
    const [patientInfo, setPatientInfo] = useState([]);
    const [patientsList, setPatientsList] = useState([]);
    const [workingAreaID, setWorkingAreaID] = useState('');
    const [workingAreasList, setWorkingAreasList] = useState([]);
    const [therapyTime, setTherapyTime] = useState(functionUtils.getCurrentHour());
    const [therapyDate, setTherapyDate] = useState(functionUtils.getToday());
    const [treatmentAdditionalInfo, setTreatmentAdditionalInfo] = useState('');

    const [therapyAmount, setTherapyAmount] = useState(10);
    const [therapyDuration, setTherapyDuration] = useState(1);

    const [treatmentTitleError, setTreatmentTitleError] = useState(false);
    const [therapyTimeError, setTherapyTimeError] = useState(false);
    const [patientNameError, setPatientNameError] = useState(false);
    const [workingAreaIDError, setWorkingAreaIDError] = useState(false);
    const [therapyDateError, setTherapyDateError] = useState(false);
    const [therapyAmountError, setTherapyAmountError] = useState(false);
    const [therapyDurationError, setTherapyDurationError] = useState(false);

    const daysOfTheWeek = [
        { label: 'label_monday', value: '0' },
        { label: 'label_tuesday', value: '1' },
        { label: 'label_wednesday', value: '2' },
        { label: 'label_thursday', value: '3' },
        { label: 'label_friday', value: '4' },
        { label: 'label_saturday', value: '5' },
        { label: 'label_sunday', value: '6' }
    ];

    const [therapyBatches, setTherapyBatches] = useState([{ days: [], time: '', duration: 0 }]);

    const loadPatientsList = async () => {
        try {
            const patients = await requester.requestGetList(patientEndpoint);
            const patientsListResponse = [];
            patients.forEach(patient => {
                patientsListResponse.push({
                    value: [patient._id, patient.patient_name],
                    label: patient.patient_name,
                });
            })
            setPatientsList(patientsListResponse);
        } catch (error) {
            console.log(error);
        };
    };

    const handleAddBatch = () => {
        setTherapyBatches([...therapyBatches, { days: [], time: '', duration: 0 }])
    };

    const handleBatchTime = (index) => {
        return (event) => {
            const newBatch = [...therapyBatches];
            newBatch[index].time = event.target.value;
            setTherapyBatches(newBatch);
        }
    };

    const handleBatchDays = (index) => {
        return (event, newDays) => {
            const newBatch = [...therapyBatches];
            newBatch[index].days = newDays;
            setTherapyBatches(newBatch);
        }
    };

    const handleDeleteBatch = (index) => {
        return (event) => {
            const newBatch = [...therapyBatches];
            newBatch.splice(index, 1);
            setTherapyBatches(newBatch);
        }
    };

    const loadWorkingAreasList = async () => {
        try {
            const areas = await requester.requestGetList(workingAreasEndpoint);
            const areasListResponse = [];
            areas.forEach(area => {
                if (area.area_available) {
                areasListResponse.push({
                    area_id: area._id,
                    area_name: area.area_name,
                });
                }
            })
            setWorkingAreasList(areasListResponse);
        } catch (error) {
            console.log(error);
        };
    };

    const handleSubmit = async () => {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBodyTreatment = {
            body: {
                title: treatmentTitle,
                patitent_info: patientInfo,
                basic_info: treatmentBasicInfo,
                therapies: [],
                additional_info: treatmentAdditionalInfo,
            },
            filter: {}
        };
        const areaName = workingAreasList.find(o => o.area_id === workingAreaID);
        const treatmentID = await requester.requestInsert(treatmentEnpoint, JSON.stringify(requestBodyTreatment));
        const therapiesList = []
        functionUtils.generateTherapyList(therapyDate, Number(therapyAmount), therapyBatches, workingAreaID, Number(therapyDuration), therapyTime).map(async (body) => {
            const requestBody = {
                body: body,
                filter: {}
            }
            therapiesList.push(await requester.requestInsert(therapyEnpoint, JSON.stringify(requestBody)));
        });
        const requestBodyTherapyList = {
            body: {
                therapies: therapiesList
            },
            filter: {
                _id: treatmentID[0]._id,
            }
        };
        await requester.requestUpdate(treatmentEnpoint, JSON.stringify(requestBodyTherapyList));
        handleClose();
    };

    // TODO: see if all requiered fields are here
    function validateRequiredFields() {
        let error = false;
        if (patientInfo === '') {
            setPatientNameError(true);
            error = true;
        } else {
            setPatientNameError(false);
        }
        if (treatmentTitle === '') {
            setTreatmentTitleError(true);
            error = true;
        } else {
            setTreatmentTitleError(false);
        }
        if (workingAreaID === '') {
            setWorkingAreaIDError(true);
            error = true;
        } else {
            setWorkingAreaIDError(false);
        }
        if (therapyDate === '') {
            setTherapyDateError(true);
            error = true;
        } else {
            setTherapyDateError(false);
        }
        if (therapyAmount === '') {
            setTherapyAmountError(true);
            error = true;
        } else {
            setTherapyAmountError(false);
        } if (therapyDuration === '') {
            setTherapyDurationError(true);
            error = true;
        } else {
            setTherapyDurationError(false);
        }
        if (therapyTime === '') {
            setTherapyTimeError(true);
            error = true;
        } else {
            setTherapyTimeError(false);
        }
        return error;
    };

    function TherapiesController(props) {
        const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
            "& .MuiToggleButtonGroup-grouped": {
                margin: theme.spacing(0.2),
                border: 0,
                "&.Mui-disabled": {
                    border: 0
                }
            }
        }));

        return (<div>
            <TextField
                id={"therapy_time_input" + props.index}
                label={t('label_therapy_time')}
                type="time"
                value={props.item.time}
                required
                // error={therapyTimeError}
                sx={{ width: 220 }}
                onChange={handleBatchTime(props.index)}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <StyledToggleButtonGroup
                size="small"
                value={props.item.days}
                onChange={handleBatchDays(props.index)}
                aria-label="text formatting"
            // error={selectedDaysError}
            >
                {/* WARN: check another environments for which day the week starts at */}
                {daysOfTheWeek.map((day, value) => {
                    return (<ToggleButton value={value}>
                        <p>{t(day.label)}</p>
                    </ToggleButton>)
                })}

            </StyledToggleButtonGroup>
            <Button onClick={handleDeleteBatch(props.index)}>
                {/* TODO modificar texto */}
                <p>Delete</p>
            </Button>
        </div>)
    };

    useEffect(() => {
        const fetchTherapies = async () => {
            await loadPatientsList();
            await loadWorkingAreasList();
        };
        fetchTherapies();
    }, []);

    return (<>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('title_add_new_treatment')}
        </Typography>
        <FormGroup>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Card bordered={false} style={{ overflow: 'auto', height: '90%' }}>
                    <Grid container>
                        <Grid container item className='grid-modal'>
                            <TextField
                                id='patient_name_input'
                                label={t('label_treatment_title')}
                                value={treatmentTitle}
                                type="text"
                                sx={{ width: '50%' }}
                                error={treatmentTitleError}
                                required
                                onChange={functionUtils.handleSetInput(setTreatmentTitle)} />
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <TextField
                                id='basic_info_input'
                                label={t('input_basic_info')}
                                multiline
                                sx={{ width: '100%' }}
                                rows={10}
                                value={treatmentBasicInfo}
                                onChange={functionUtils.handleSetInput(setTreatmentBasicInfo)} />
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <FormControl fullWidth>
                                {/* TODO: autocomplete component */}
                                <InputLabel id="patient_list_label" required>{t('label_patient_list')}</InputLabel>
                                <Select
                                    labelId="patient_list_label"
                                    label={t('label_patient_list')}
                                    id="patient_list_select"
                                    value={patientInfo}
                                    onChange={functionUtils.handleSetInput(setPatientInfo)}
                                    error={patientNameError}
                                    required
                                >
                                    {patientsList.map((option) => (
                                        <MenuItem key={option.value[0]} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <FormControl fullWidth>
                                <InputLabel id="working_area_list_label" required>{t('label_working_area_list')}</InputLabel>
                                <Select
                                    labelId="working_area_list_label"
                                    label={t('label_working_area_list')}
                                    id="working_area_list_select"
                                    value={workingAreaID}
                                    onChange={functionUtils.handleSetInput(setWorkingAreaID)}
                                    error={workingAreaIDError}
                                    required
                                >
                                    {workingAreasList.map((option) => (
                                        <MenuItem key={option.area_id} value={option.area_id}>
                                            {option.area_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* TODO: arreglar los nombres */}
                        <Grid container item className='grid-modal'>
                            <TextField
                                fullWidth
                                id='input_therapy_amount'
                                label={t('label_therapy_amount')}
                                value={therapyAmount}
                                type="number"
                                error={therapyAmountError}
                                sx={{ width: '45%' }}
                                required
                                onChange={functionUtils.handleSetInput(setTherapyAmount)} />
                            <TextField
                                fullWidth
                                id='patient_id_input_create'
                                label={'therapy duration'}
                                value={therapyDuration}
                                type="number"
                                error={therapyDurationError}
                                sx={{ width: '45%' }}
                                required
                                onChange={functionUtils.handleSetInput(setTherapyDuration)} />
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <TextField
                                id="therapy_date_input"
                                label={t('label_therapy_date')}
                                type="date"
                                pattern="\d{4}-\d{2}-\d{2}"
                                value={therapyDate}
                                required
                                error={therapyDateError}
                                sx={{ width: '45%' }}
                                onChange={functionUtils.handleSetInput(setTherapyDate)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id={"therapy_time_input"}
                                label={t('label_therapy_time')}
                                type="time"
                                value={therapyTime}
                                required
                                error={therapyTimeError}
                                sx={{ width: '45%' }}
                                onChange={functionUtils.handleSetInput(setTherapyTime)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <div sx={{ width: '50%' }}>
                                {therapyBatches.map((item, index) => {
                                    return (<TherapiesController index={index} item={item} key={item} />)
                                })}
                            </div>
                            <Button onClick={handleAddBatch} sx={{ width: '45%' }}>
                                {/* TODO modificar texto */}
                                <p>ADD BATCH</p>
                            </Button>
                        </Grid>
                        <Grid container item className='grid-modal'>
                            <TextField
                                id='additional_info_input'
                                label={t('label_additional_info')}
                                multiline
                                rows={10}
                                sx={{ width: '100%' }}
                                value={treatmentAdditionalInfo}
                                onChange={functionUtils.handleSetInput(setTreatmentAdditionalInfo)} />
                        </Grid>
                    </Grid>
                </Card>
                <Button onClick={handleSubmit}>{t('button_create')}</Button>
                <Button onClick={handleClose}>{t('button_cancel')}</Button>
            </Box>
        </FormGroup>

    </>)
};