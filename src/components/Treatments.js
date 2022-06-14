// create treatments list with all treatments and a modal to see all therapies for a treatment
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [patientID, setPatientID] = useState('');
    const [treatmentBasicInfo, setTreatmentBasicInfo] = useState('');
    const [treatmentAdditInfo, setTreatmentAdditInfo] = useState('');
    const [therapiesList, setTherapiesList] = useState([]);

    const [treatmentTitleError, setTreatmentTitleError] = useState(false);
    const [patientIDError, setPatientIDError] = useState(false);
    const [treatmentBasicInfoError, setTreatmentBasicInfoError] = useState(false);
    const [therapiesListError, setTherapiesListError] = useState(false);

    const columns = [
        {
            field: 'title', headerName: t('title_treatment_name'), width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.id)}>{params.value}</Link>
            )
        },
        {
            field: 'patitent_info', headerName: t('title_therapies'), width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.id)}>{params.value}</Link>
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
                    icon={<DeleteIcon />}
                    label={t('button_delete')}
                    onClick={() => { handleDelete(params.id) }}
                    showInMenu
                />,
            ],
        }
    ];

    async function handleOpenCreate() { setOpenCreate(true) };

    async function handleOpenUpdate(shopItemID) {
        const treatmentInfo = await getTreatment(shopItemID);
        setTreatmentTitle(treatmentInfo.title);
        setPatientID(treatmentInfo.patitent_id);
        setTreatmentBasicInfo(treatmentInfo.basic_info);
        setTherapiesList(treatmentInfo.therapies);
        setTreatmentAdditInfo(treatmentInfo.additional_info);
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
            console.log(treatmentsList);
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
                // article_name: shopItemName,
                // basic_info: shopItemBasicInfo,
                // number_of_items: Number(numberOfItems),
                // price: Number(shopItemPrice),
                // currency: shopItemCurrency
            },
            filter: {}
        };

        if (openCreate) {
            requester.requestInsert(treatmentEndpoint, JSON.stringify(requestBody));
            setOpenCreate(false);
        } else if (openUpdate) {
            // requestBody.filter._id = updateShopItemID;
            requester.requestUpdate(treatmentEndpoint, JSON.stringify(requestBody));
            setOpenUpdate(false);
        }
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
        setTherapiesList([]);
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
        if (therapiesList === []) {
            setTherapiesListError(true);
            return true;
        } else {
            setTherapiesListError(false);
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
                    {t('title_shop_list')}
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



            <Fab
                onClick={handleOpenCreate}
                variant="text"
                style={{ position: 'absolute', bottom: 10, right: 10 }}
                size="medium"
                color="secondary">
                <AddIcon />
            </Fab>
        </div>
    );
};