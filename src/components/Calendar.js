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
import InputLabel from '@mui/material/InputLabel';
import { FormGroup, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TherapyRequests from '../requests/therapyRequests.js';
import TreatmentsRequests from '../requests/treatmentsRequests.js';
import PatientListRequests from '../requests/patientListRequests.js';
import WorkingAreaRequests from '../requests/workingAreaRequests.js';
import calendarProps from '../utils/calendarProps.js';
import functionUtils from '../utils/functionUtils.js';
import Webcam from "react-webcam";

export function Calendar() {
    const [t] = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    
    const [therapiesList, setTherapiesList] = useState([]);


    const loadTherapies = async () => {
        try {
            const therapies = await TherapyRequests.getTherapyList();
            const events = [];
            await Promise.all(therapies.map(async (therapy) => {
                const startDate = new Date(therapy.date + "T" + therapy.time);
                const endDate = new Date(functionUtils.calculateEndHour(therapy.date + "T" + therapy.time, therapy.duration));
                const event = {
                    event_id: therapy._id,
                    start: startDate,
                    end: endDate,
                    title: "Therapy: " + therapy.title
                };
                events.push(event);
            }));
            setTherapiesList(events);
        } catch (error) {
            console.log(error);
        };
    };

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    const handleClose = () => {
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
    



    function CustomEditor({scheduler}) {
        console.log(scheduler)
        return (
            <Box class="modal-alt-box-big">
                <CreateTreatment t={t} setIsLoaded={setIsLoaded} handleClose={() => {handleClose(); scheduler.close();}} />
            </Box>
        );
    }

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
                    customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                    viewerExtraComponent={(fields, event) => <CustomViewer fields={fields} setIsLoaded={setIsLoaded} event={event}/>}
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
                aria-describedby="modal-modal-content">
                <Box class='modal-box-big'>
                    <CreateTreatment t={t} setIsLoaded={setIsLoaded} handleClose={handleClose} />
                </Box>
            </Modal>
            
        </div >
    )
}
function ValidateWithCamera({setIsLoaded, therapyId}) {
    const { t } = useTranslation();
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
        setIsLoaded(false);
        const therapyBody = {
            body: {
                date: functionUtils.getToday(),
                area_id: "0",
                time: "00:00:00",
                therapy_status: "open",
                action: "validate",
                patient_image: url,
            },
            filter: { _id: therapyId }
        };
        const response = await TherapyRequests.updateTherapy(JSON.stringify(therapyBody))
        if (response.result) {
            setImageValidated(response.id);
        } else {
            setImageValidated(response.message);
        }
        setIsLoaded(true);
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
            <Button onClick={() => handleValidateFace(therapyId) }>Validate Patient's Face</Button>
        </FormGroup>
        <Typography> {imageValidated}</Typography>
    </Box>);
}
function CustomViewer({fields, event, setIsLoaded }) {
    console.log(event)
    const [ t ] = useTranslation();
    const [faceValidation, setFaceValidation] = useState(false);
    const [openValidateFace, setOpenValidateFace] = useState(false);
    const handleOpenValidateFace = async () => {
        setOpenValidateFace(true);
    };
    const handleClose = () => {
        setOpenValidateFace(false);
    }
    return (
        <>
            <Typography variant="h6" component="h2">
                {event.title}
            </Typography>
            <Typography variant="body1" component="p">
                {/* TODO modificar texto */}
                {t('label_start')}: {event.start.toString()}
            </Typography>
            <Typography variant="body1" component="p">
                 {/* TODO modificar texto */}
                End: {event.end.toString()}
            </Typography>
            <Button onClick={() => setFaceValidation(!faceValidation)}>

                 {/* TODO modificar texto */}
                toggle
            </Button>
            <PatientValidation faceValidation={faceValidation} handleOpenValidateFace={handleOpenValidateFace} />
            <Modal
                open={openValidateFace}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content" >
                <ValidateWithCamera setIsLoaded={setIsLoaded} therapyId={event.event_id}/>
            </Modal>
        </>
    );
}
function PatientValidation({faceValidation, handleOpenValidateFace}) {
    const [ t ] = useTranslation();
    if (faceValidation) {
        return (
            <Typography variant="h2" component="p">
                <Button onClick={handleOpenValidateFace}>
                    {t('label_open_camera')}
                </Button>
            </Typography>
        );
    } else {
        return (
            <Typography variant="h2" component="p">
                 {/* TODO modificar texto */}
                id validation here
            </Typography>
        );
    }
}
function CreateTreatment({t, setIsLoaded, handleClose}){
    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [treatmentBasicInfo, setTreatmentBasicInfo] = useState('');
    const [patientInfo, setPatientInfo] = useState([]);
    const [patientsList, setPatientsList] = useState([]);
    const [workingAreaName, setWorkingAreaName] = useState('');
    const [workingAreasList, setWorkingAreasList] = useState([]);
    const [therapyDate, setTherapyDate] = useState(functionUtils.getToday());
    const [treatmentAdditionalInfo, setTreatmentAdditionalInfo] = useState('');

    const [therapyAmount, setTherapyAmount] = useState(10);
    const [therapyDuration, setTherapyDuration] = useState(1);

    const [treatmentTitleError, setTreatmentTitleError] = useState(false);
    const [patientNameError, setPatientNameError] = useState(false);
    const [workingAreaNameError, setWorkingAreaNameError] = useState(false);
    const [therapyDateError, setTherapyDateError] = useState(false);
    const [therapyAmountError, setTherapyAmountError] = useState(false);
    const [therapyDurationError, setTherapyDurationError] = useState(false);

    const [therapyBatches, setTherapyBatches] = useState([{ days: [], time: '', duration: 0 }]);

    const loadPatientsList = async () => {
        try {
            const patients = await PatientListRequests.getPatientsList();
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
    }

    const handleBatchTime = (index) => {
        return (event) => {
            const newBatch = [...therapyBatches];
            newBatch[index].time = event.target.value;
            setTherapyBatches(newBatch);
        }
    }
    const handleBatchDays = (index) => {
        return (event, newDays) => {
            const newBatch = [...therapyBatches];
            newBatch[index].days = newDays;
            setTherapyBatches(newBatch);
        }
    }
    const handleDeleteBatch = (index) => {
        return (event) => {
            const newBatch = [...therapyBatches];
            newBatch.splice(index, 1);
            setTherapyBatches(newBatch);
        }
    }
    const loadWorkingAreasList = async () => {
        try {
            const areas = await WorkingAreaRequests.getWorkingAreas();
            const areasListResponse = [];
            areas.forEach(area => {
                areasListResponse.push({
                    value: area._id,
                    label: area.area_name,
                });
            })
            setWorkingAreasList(areasListResponse);
        } catch (error) {
            console.log(error);
        };
    };
    const handleSubmit = async () => {
        if (validateRequiredFields()) return;
        console.log("validate working")
        setIsLoaded(false);
        const requestBodyTreatment = {
            body: {
                patitent_info: patientInfo,
                basic_info: treatmentBasicInfo,
                therapies: [],
                additional_info: treatmentAdditionalInfo,
            },
            filter: {}
        };

        const treatmentID = await TreatmentsRequests.insertTreatment(JSON.stringify(requestBodyTreatment));
        console.log("insertTreatment working")
        const therapiesList = []
        functionUtils.generateTherapyList(therapyDate, Number(therapyAmount), therapyBatches, workingAreaName, Number(therapyDuration)).map(async (body) => {
            const requestBody = {
                body: body,
                filter: {}
            }
            therapiesList.push(await TherapyRequests.insertTherapy(JSON.stringify(requestBody)));
        });
        console.log("generateTherapyLlist working")
        const requestBodyTherapyList = {
            body: {
                therapies: therapiesList
            },
            filter: {
                _id: treatmentID[0]._id,
            }
        };
        await TreatmentsRequests.updateTreatment(JSON.stringify(requestBodyTherapyList));
        console.log("update working")
        
        handleClose();
        console.log("handleClose working")
        
    };
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
        if (workingAreaName === '') {
            setWorkingAreaNameError(true);
            error = true;
        } else {
            setWorkingAreaNameError(false);
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
        return error;
    };

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        "& .MuiToggleButtonGroup-grouped": {
            margin: theme.spacing(0.2),
            border: 0,
            "&.Mui-disabled": {
                border: 0
            }
        }
    }));

    function TherapiesController(props) {
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
                <ToggleButton value="0">
                    <p>{t('label_monday')}</p>
                </ToggleButton>
                <ToggleButton value="1">
                    <p>{t('label_tuesday')}</p>
                </ToggleButton>
                <ToggleButton value="2">
                    <p>{t('label_wednesday')}</p>
                </ToggleButton>
                <ToggleButton value="3">
                    <p>{t('label_thursday')}</p>
                </ToggleButton>
                <ToggleButton value="4">
                    <p>{t('label_friday')}</p>
                </ToggleButton>
                <ToggleButton value="5">
                    <p>{t('label_saturday')}</p>
                </ToggleButton>
                <ToggleButton value="6">
                    <p>{t('label_sunday')}</p>
                </ToggleButton>

            </StyledToggleButtonGroup>
            <Button onClick={handleDeleteBatch(props.index)}>
                <p>Delete</p>
            </Button>
        </div>)
    }
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
            <TextField
                id='patient_name_input'
                label={t('label_treatment_title')}
                value={treatmentTitle}
                type="text"
                sx={{ width: 550 }}
                error={treatmentTitleError}
                required
                onChange={functionUtils.handleSetInput(setTreatmentTitle)} />
            <TextField
                id='basic_info_input'
                label={t('input_basic_info')}
                multiline
                rows={10}
                value={treatmentBasicInfo}
                onChange={functionUtils.handleSetInput(setTreatmentBasicInfo)} />
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
            <FormControl fullWidth>
                <InputLabel id="working_area_list_label" required>{t('label_working_area_list')}</InputLabel>
                <Select
                    labelId="working_area_list_label"
                    label={t('label_working_area_list')}
                    id="working_area_list_select"
                    value={workingAreaName}
                    onChange={functionUtils.handleSetInput(setWorkingAreaName)}
                    error={workingAreaNameError}
                    required
                >
                    {workingAreasList.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* TODO: arreglar los nombres */}
            <TextField
                fullWidth
                id='input_therapy_amount'
                label={t('label_therapy_amount')}
                value={therapyAmount}
                type="number"
                error={therapyAmountError}
                sx={{ width: 220 }}
                required
                onChange={functionUtils.handleSetInput(setTherapyAmount)} />
            <TextField
                fullWidth
                id='patient_id_input_create'
                label={'therapy duration'}
                value={therapyDuration}
                type="number"
                error={therapyDurationError}
                sx={{ width: 220 }}
                required
                onChange={functionUtils.handleSetInput(setTherapyDuration)} />
            <TextField
                id="therapy_date_input"
                label={t('label_therapy_date')}
                type="date"
                pattern="\d{4}-\d{2}-\d{2}"
                value={therapyDate}
                required
                error={therapyDateError}
                sx={{ width: 220 }}
                onChange={functionUtils.handleSetInput(setTherapyDate)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <div>
                {therapyBatches.map((item, index) => {
                    return (<TherapiesController index={index} item={item} />)
                })}
            </div>
            <Button onClick={handleAddBatch}>
                 {/* TODO modificar texto */}
                <p>ADD BATCH</p>
            </Button>
            <TextField
                id='additional_info_input'
                label={t('label_additional_info')}
                multiline
                rows={10}
                value={treatmentAdditionalInfo}
                onChange={functionUtils.handleSetInput(setTreatmentAdditionalInfo)} />
            <Button onClick={handleSubmit}>{t('button_create')}</Button>
            <Button onClick={handleClose}>{t('button_cancel')}</Button>
        </FormGroup>
    </>)
}