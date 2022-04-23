import { useState, useEffect } from 'react';
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import '../styles/App.css';
import Scheduler from "react-mui-scheduler";

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
import functionUtils from '../utils/functionUtils.js'
import '../styles/App.css';

export function Calendar() {
    const [t] = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [state, setState] = useState(calendarProps);
    const [openCreate, setOpenCreate] = useState(false);
    const [therapiesList, setTherapiesList] = useState([]);
    const [therapyAmount, setTherapyAmount] = useState(10);

    const [treatmentTitleError, setTreatmentTitleError] = useState(false);
    const [patientNameError, setPatientNameError] = useState(false);
    const [workingAreaNameError, setWorkingAreaNameError] = useState(false);
    const [therapyDateError, setTherapyDateError] = useState(false);
    const [therapyAmountError, setTherapyAmountError] = useState(false);

    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [treatmentBasicInfo, setTreatmentBasicInfo] = useState('');
    const [patientInfo, setPatientInfo] = useState([]);
    const [patientsList, setPatientsList] = useState([]);
    const [workingAreaName, setWorkingAreaName] = useState('');
    const [workingAreasList, setWorkingAreasList] = useState([]);
    const [therapyDate, setTherapyDate] = useState(functionUtils.getToday());
    const [treatmentAdditionalInfo, setTreatmentAdditionalInfo] = useState('');

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        "& .MuiToggleButtonGroup-grouped": {
            margin: theme.spacing(0.2),
            border: 0,
            "&.Mui-disabled": {
                border: 0
            }
        }
    }));
    const [selectedDays, setSelectedDays] = useState(() => []);

    const handleFormat = (event, newFormats) => {
      setSelectedDays(newFormats);
      console.log(newFormats);
    };
    const loadTherapies = async () => {
        try {
            const therapies = await TherapyRequests.getTherapyList();
            const events = [];
            await Promise.all(therapies.map(async (therapy) => {
                const event = {
                    id: therapy._id,
                    area_id: therapy.area_id,
                    label: "Therapy: " + therapy.title,
                    groupLabel: "Dr Shaun Murphy",
                    user: "Dr Shaun Murphy",
                    color: "#f28f6a",
                    startHour: functionUtils.getCurrentHour(),
                    endHour: functionUtils.calculateEndHour(functionUtils.getCurrentHour(), 60),
                    date: therapy.date,
                    createdAt: new Date(),
                    createdBy: "Kristina Mayer",
                    description: therapy.description,
                    patient: therapy.patient,
                    workingArea: therapy.workingArea,
                    additionalInfo: therapy.additionalInfo,
                };
                events.push(event);
            }));
            setTherapiesList(events);
        } catch (error) {
            console.log(error);
        };
    };

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

    const handleOpenCreate = async () => {
        setOpenCreate(true);
        await loadPatientsList();
        await loadWorkingAreasList();
    };

    const handleClose = () => {
        console.log("handleClose");
        setOpenCreate(false);
        cleanModalFields();
    };

    const handleCellClick = (event, row, day) => {
        // Do something...
    }

    const handleEventClick = (event, item) => {
        // Do something...
    }

    const handleEventsChange = (item) => {
        // Do something...
    }

    const handleAlertCloseButtonClicked = (item) => {
        // Do something...
    }

    const handleSubmit = async () => {
        if (validateRequiredFields()) return;
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
        if (openCreate) {
            const treatmentID = await TreatmentsRequests.insertTreatment(JSON.stringify(requestBodyTreatment));
            const therapiesList = []
            functionUtils.generateTherapyList(functionUtils.getToday(), 10, ["2", "4"], workingAreaName).map(async(body) => {
                const requestBody = {
                    body: body,
                    filter: {}
                }
                therapiesList.push(await TherapyRequests.insertTherapy(JSON.stringify(requestBody)));
                });
            const requestBodyTherapyList = {
                body: {
                    therapies: therapiesList
                },
                filter: {
                    _id: treatmentID[0]._id,
                }
            };
            await TreatmentsRequests.updateTreatment(JSON.stringify(requestBodyTherapyList));
        }
        handleClose();
        setCalendar();
    };

    function setCalendar() {
        setIsLoaded(true);
        return setState(calendarProps)
    }

    function cleanModalFields() { };

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
        return error;
    };

    useEffect(() => {
        const fetchTherapies = async () => {
            await loadTherapies();
        };
        fetchTherapies();
        setCalendar();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke' }}>
                    {t('title_calendar')}
                </Button>
                <Button onClick={() => { handleOpenCreate() }} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_treatment')} </Button>
            </div>
            <div style={{ height: 600, width: '100%', background: 'white' }}>
                <Scheduler
                    events={therapiesList}
                    options={state?.options}
                    alertProps={state?.alertProps}
                    toolbarProps={state?.toolbarProps}
                    onEventsChange={handleEventsChange}
                    onCellClick={handleCellClick}
                    onTaskClick={handleEventClick}
                    onAlertCloseButtonClicked={handleAlertCloseButtonClicked}
                />
            </div>
            <Modal
                open={openCreate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-content">
                <Box className='modal-box-big'>
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
                            label={t('basic_info_input')}
                            multiline
                            rows={10}
                            value={treatmentBasicInfo}
                            onChange={functionUtils.handleSetInput(setTreatmentBasicInfo)} />
                        <FormControl fullWidth>
                            {/* TODO: autocomplete component */}
                            <InputLabel id="patient_list_label" required>{t('patient_list_label')}</InputLabel>
                            <Select
                                labelId="patient_list_label"
                                label={t('patient_list_label')}
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
                            <InputLabel id="working_area_list_label" required>{t('working_area_list_label')}</InputLabel>
                            <Select
                                labelId="working_area_list_label"
                                label={t('working_area_list_label')}
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
                        <TextField
                            id="therapy_date_input"
                            label={t('label_therapy_date')}
                            type="date"
                            value={therapyDate}
                            required
                            error={therapyDateError}
                            sx={{ width: 220 }}
                            onChange={functionUtils.handleSetInput(setTherapyDate)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            id='patient_id_input_create'
                            label={t('label_patient_id')}
                            value={therapyAmount}
                            type="number"
                            error={therapyAmountError}
                            sx={{ width: 220 }}
                            required
                            onChange={functionUtils.handleSetInput(setTherapyAmount)} />
                        <StyledToggleButtonGroup
                            size="small"
                            value={selectedDays}
                            onChange={handleFormat}
                            aria-label="text formatting"
                        >
                            <ToggleButton value="1">
                                <p>MOn</p>
                            </ToggleButton>
                            <ToggleButton value="2">
                                <p>TUE</p>
                            </ToggleButton>
                            <ToggleButton value="3">
                                <p>WES</p>
                            </ToggleButton>
                            <ToggleButton value="4">
                                <p>THu</p>
                            </ToggleButton>
                            <ToggleButton value="5">
                                <p>FRI</p>
                            </ToggleButton>
                            <ToggleButton value="6">
                                <p>SAT</p>
                            </ToggleButton>
                            <ToggleButton value="0">
                                <p>SUN</p>
                            </ToggleButton>
   
                        </StyledToggleButtonGroup>
                        <TextField
                            id='additional_info_input'
                            label={t('label_additional_info')}
                            multiline
                            rows={10}
                            value={treatmentAdditionalInfo}
                            onChange={functionUtils.handleSetInput(setTreatmentAdditionalInfo)} />
                        <Button onClick={handleSubmit}>{t('button_create')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
        </div >
    )
}
