import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import requester from '../apiRequester/Requester.js';
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'
import '../styles/WorkingAreaList.css';

export function WorkingArea() {
    const [t] = useTranslation();
    const workingAreaEndpoint = 'workingArea';
    const dataGridLocales = localizedComponents.DatagridLocales();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const [areaName, setAreaName] = useState('');
    const [areaCapacity, setAreaCapacity] = useState('');
    const [areaAvialable, setAreaAvialable] = useState(false);
    const [updateTargetID, setUpdateTargetID] = useState('');

    const [areaNameError, setAreaNameError] = useState(false);
    const [areaCapacityError, setAreaCapacityError] = useState(false);

    const columns = [
        {
            field: 'area_name', headerName: t('title_area_name'), width: 200, renderCell: (params) => (
                <Link underline="none" rel="noopener" onClick={() => { handleOpenUpdate(params.id) }}>{params.value}</Link>
            )
        },
        { field: 'area_total_capacity', headerName: t('title_area_total_capacity'), width: 200 },
        { field: 'area_available', headerName: t('title_area_avialable'), width: 200 },
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
                    onClick={() => { deleteArea(params.id) }}
                    showInMenu
                />,
            ],
        }
    ]

    async function handleOpenCreate() { setOpenCreate(true) };

    async function handleOpenUpdate(areaID) {
        const areaInfo = await getArea(areaID);
        setAreaName(areaInfo.area_name);
        setAreaCapacity(areaInfo.area_total_capacity);
        setAreaAvialable(areaInfo.area_available);
        setUpdateTargetID(areaID);
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

    async function enableTextFields(checked) {
        setIsEditing(checked);
    };

    async function handleCheckBoxChange(event) {
        setAreaAvialable(event.target.checked);
    };

    async function loadWorkingAreaList() {
        try {
            const WorkingAreas = await requester.requestGetList(workingAreaEndpoint);
            setElements(WorkingAreas)
            setIsLoaded(true)
        } catch (error) {
            setIsLoaded(true)
            console.log(error)
        };
    };

    async function getArea(areaID) {
        return await requester.requestGet(workingAreaEndpoint, areaID);
    };

    async function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                area_name: areaName,
                area_total_capacity: Number(areaCapacity),
                area_available: areaAvialable,
            },
            filter: {},
        };
        if (openCreate) {
            await requester.requestInsert(workingAreaEndpoint, JSON.stringify(requestBody));
        } else if (openUpdate) {
            requestBody.filter._id = updateTargetID;
            await requester.requestUpdate(workingAreaEndpoint, JSON.stringify(requestBody));
        }
        loadWorkingAreaList();
        cleanModalFields();
        handleClose();
    };

    async function deleteArea(areaID) {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: areaID,
            },
        };
        await requester.requestDelete(workingAreaEndpoint, JSON.stringify(requestBody))
        loadWorkingAreaList();
    };

    function validateRequiredFields() {
        let error = false;
        if (areaName === "") {
            setAreaNameError(true);
            return true;
        } else {
            error = false;
            setAreaNameError(false);
        }
        if (areaCapacity === "") {
            setAreaCapacityError(true);
            return true;
        } else {
            error = false;
            setAreaCapacityError(false);
        }
        return error;
    };

    function cleanModalFields() {
        setAreaName('');
        setAreaCapacity('');
        setUpdateTargetID('');
        setAreaAvialable(false);
    };

    useEffect(() => {
        loadWorkingAreaList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_area_list')}
                </Button>
            </div>
            <div style={{ height: '100%', width: '100%', background: 'white' }}>
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
                        {t('title_area_create')}
                    </Typography>
                    <FormGroup>
                        <TextField
                            fullWidth
                            error={areaNameError}
                            required i
                            d='area_name'
                            label={t('label_area_name')}
                            value={areaName}
                            onChange={functionUtils.handleSetInput(setAreaName)} />
                        <TextField
                            fullWidth
                            error={areaCapacityError}
                            type="number"
                            equired
                            id='area_capacity'
                            inputProps={{ inputMode: 'numeric' }}
                            label={t('label_area_total_capacity')}
                            value={areaCapacity}
                            onChange={functionUtils.handleSetInput(setAreaCapacity)} />
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
                        {t('title_update_area')}
                    </Typography>

                    <FormGroup>
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label={t('switch_enable_edit')} />
                        <TextField
                            disabled={!isEditing}
                            id='area_name'
                            onChange={functionUtils.handleSetInput(setAreaName)}
                            value={areaName}
                            label={t('label_area_name')} />
                        <TextField
                            disabled={!isEditing}
                            id='area_capacity'
                            type="number"
                            onChange={functionUtils.handleSetInput(setAreaCapacity)}
                            label={t('label_area_total_capacity')}
                            value={areaCapacity} />
                        <FormControlLabel control={
                            <Checkbox
                                disabled={!isEditing}
                                id='area_avialable'
                                onChange={handleCheckBoxChange}
                                checked={areaAvialable} />
                        } label={t('label_area_avialable')} />
                        <Button disabled={!isEditing} onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
            <Fab onClick={handleOpenCreate} variant="text" style={{ position: 'absolute', bottom: 10, right: 10 }} size="medium" color="secondary">
                <AddIcon />
            </Fab>
        </div>
    );
};