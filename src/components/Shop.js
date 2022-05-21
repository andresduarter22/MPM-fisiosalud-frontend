import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    FormGroup,
    Button,
    Box,
    Typography,
    Fab,
    Link,
    Modal,
    TextField,
    FormControl,
    Select,
    InputLabel,
    FormControlLabel,
    MenuItem,
    Switch,
} from '@mui/material';
import '../styles/App.css';
import requester from '../apiRequester/Requester.js';
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'

export function Shop() {
    const [t] = useTranslation();
    const shopItemEndpoint = 'shopArticle';
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openCreate, setOpenCreate] = React.useState(false);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [updateShopItemID, setUpdateShopItemID] = useState('');
    const [shopItemName, setShopItemName] = useState('');
    const [shopItemBasicInfo, setShopItemBasicInfo] = useState('');
    const [numberOfItems, setNumberOfItems] = useState('');
    const [shopItemPrice, setShopItemPrice] = useState('');
    const [shopItemCurrency, setShopItemCurrency] = useState('');
    const [shopItemCurrencyOptions] = useState([
        { value: 'Dollars', label: t('label_shop_item_currency_dollar') },
        { value: 'Bolivianos', label: t('label_shop_item_currency_boliviano') },
    ]);

    const [shopItemNameError, setShopItemNameError] = useState(false);
    const [shopItemBasicInfoError, setShopItemBasicInfoError] = useState(false);
    const [numberOfItemsError, setNumberOfItemsError] = useState(false);
    const [shopItemPriceError, setShopItemPriceError] = useState(false);
    const [shopItemCurrencyError, setShopItemCurrencyError] = useState(false);

    const handleOpenCreate = () => setOpenCreate(true);

    const handleOpenUpdate = async (shopItemID) => {
        const shopItemInfo = await getShopItem(shopItemID);
        setUpdateShopItemID(shopItemID);
        setShopItemName(shopItemInfo.article_name);
        setShopItemBasicInfo(shopItemInfo.basic_info);
        setNumberOfItems(shopItemInfo.number_of_items);
        setShopItemPrice(shopItemInfo.price);
        setShopItemCurrency(shopItemInfo.currency);
        setOpenUpdate(true);
    }

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

    const cleanModalFields = () => {
        setShopItemName('');
        setShopItemBasicInfo('');
        setNumberOfItems('');
        setShopItemPrice('');
    };

    function validateRequiredFields() {
        let error = false;
        if (shopItemName === '') {
            setShopItemNameError(true);
            return true;
        } else {
            setShopItemNameError(false);
            error = false;
        }
        if (shopItemBasicInfo === '') {
            setShopItemBasicInfoError(true);
            return true;
        } else {
            setShopItemBasicInfoError(false);
            error = false;
        }
        if (numberOfItems === '') {
            setNumberOfItemsError(true);
            return  true;
        } else {
            setNumberOfItemsError(false);
            error = false;
        }
        if (shopItemPrice === '') {
            setShopItemPriceError(true);
            return true;
        } else {
            setShopItemPriceError(false);
            error = false;
        }
        if (shopItemCurrency === '') {
            setShopItemCurrencyError(true);
            return true;
        } else {
            setShopItemCurrencyError(false);
            error = false;
        }
        return error;
    };

    const dataGridLocales = localizedComponents.DatagridLocales();

    const columns = [
        {
            field: 'article_name', headerName: 'Item Name', width: 200, renderCell: (params) => (
                <Link underline="none" rel='noopener' onClick={() => handleOpenUpdate(params.id)}>{params.value}</Link>
            )
        },
        { field: 'basic_info', headerName: 'Basic Information', width: 200 },
        { field: 'number_of_items', headerName: 'Number of Items', width: 200 },
        { field: 'price', headerName: 'Price', width: 200 },
        { field: 'currency', headerName: 'Currency', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleOpenUpdate(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => { handleDelete(params.id) }}
                    showInMenu
                />,
            ],
        }
    ]

    const getShopItem = async (itemID) => {
        try {
            const shopItem = await requester.requestGet(shopItemEndpoint, itemID);
            return shopItem;
        } catch (error) {
            console.log(error);
        };
    };

    function loadShopList() {
        requester.requestGetList(shopItemEndpoint).then(result => {
            setElements(result)
            setIsLoaded(true)
        }, error => {
            setIsLoaded(true)
            console.log(error)
        });
    }

    function handleSubmit() {
        if (validateRequiredFields()) return;
        setIsLoaded(false);
        const requestBody = {
            body: {
                article_name: shopItemName,
                basic_info: shopItemBasicInfo,
                number_of_items: Number(numberOfItems),
                price: Number(shopItemPrice),
                currency: shopItemCurrency
            },
            filter: {}
        };

        if (openCreate) {
            requester.requestInsert(shopItemEndpoint, JSON.stringify(requestBody));
            setOpenCreate(false);
        } else if (openUpdate) {
            requestBody.filter._id = updateShopItemID;
            requester.requestUpdate(shopItemEndpoint, JSON.stringify(requestBody));
            setOpenUpdate(false);
        }
        handleClose();
        loadShopList();
    };

    const handleDelete = async (id) => {
        setIsLoaded(false);
        const requestBody = {
            filter: {
                _id: id,
            }
        }
        requester.requestDelete(shopItemEndpoint, JSON.stringify(requestBody));
        loadShopList();
    };

    useEffect(() => {
        loadShopList();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="h3" component="div" style={{ display: 'flex', justifyContent: 'flex-end', color: 'whitesmoke', marginTop: 15, marginBottom: 15 }}>
                    {t('title_shop_list')}
                </Button>
                {/* <Button onClick={handleOpenCreate} variant="text" style={{ marginTop: 15, marginBottom: 15 }}> {t('button_add_new_staff')} </Button> */}
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
                aria-describedby="modal-modal-content" >
                <Box className='modal-box'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('title_create_new_shop_item')}
                    </Typography>
                    <FormGroup>
                        <TextField id="shop_item_name_input" label={t('label_shop_item_name')} value={shopItemName} error={shopItemNameError} required
                            onChange={functionUtils.handleSetInput(setShopItemName)} />
                        <TextField id="shop_item_basic_info_input" label={t('label_basic_info')} value={shopItemBasicInfo} error={shopItemBasicInfoError} required
                            onChange={functionUtils.handleSetInput(setShopItemBasicInfo)} multiline rows={10}/>
                        <TextField fullWidth id='shop_item_amount_input' type={'number'} label={t('label_shop_item_amount')} value={numberOfItems} error={numberOfItemsError} required
                            onChange={functionUtils.handleSetInput(setNumberOfItems)} />
                        <TextField id="shop_item_price_input" type={'number'} label={t('label_shop_item_price')} value={shopItemPrice} error={shopItemPriceError} required
                            onChange={functionUtils.handleSetInput(setShopItemPrice)} />
                        <FormControl fullWidth>
                            <InputLabel id="shop_item_currency_label" required>{t('label_shop_item_currency')}</InputLabel>
                            <Select
                                labelId="shop_item_currency_label"
                                label={t('label_shop_item_currency')}
                                id="shop_item_currency_select"
                                value={shopItemCurrency}
                                onChange={functionUtils.handleSetInput(setShopItemCurrency)}
                                error={shopItemCurrencyError}
                                required
                            >
                                {shopItemCurrencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        {t('title_update_shop_item')}
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Switch onChange={switchHandler} />} label="Enable editing" />
                        <TextField id="shop_item_name_input" label={t('label_shop_item_name')} value={shopItemName} error={shopItemNameError} required
                            onChange={functionUtils.handleSetInput(setShopItemName)} disabled={!isEditing} />
                        <TextField id="shop_item_basic_info_input" label={t('label_basic_info')} value={shopItemBasicInfo} error={shopItemBasicInfoError} required
                            onChange={functionUtils.handleSetInput(setShopItemBasicInfo)} disabled={!isEditing} multiline rows={10}/>
                        <TextField fullWidth id='shop_item_amount_input' type={'number'} label={t('label_shop_item_amount')} value={numberOfItems} error={numberOfItemsError} required
                            onChange={functionUtils.handleSetInput(setNumberOfItems)} disabled={!isEditing} />
                        <TextField id="shop_item_price_input" type={'number'} label={t('label_shop_item_price')} value={shopItemPrice} error={shopItemPriceError} required
                            onChange={functionUtils.handleSetInput(setShopItemPrice)} disabled={!isEditing} />
                        <FormControl fullWidth>
                            <InputLabel id="shop_item_currency_label" required>{t('label_shop_item_currency')}</InputLabel>
                            <Select
                                labelId="shop_item_currency_label"
                                label={t('label_shop_item_currency')}
                                id="shop_item_currency_select"
                                value={shopItemCurrency}
                                onChange={functionUtils.handleSetInput(setShopItemCurrency)}
                                error={shopItemCurrencyError}
                                required
                                disabled={!isEditing}
                            >
                                {shopItemCurrencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button disabled={!isEditing} onClick={handleSubmit}>{t('button_update')}</Button>
                    </FormGroup>
                </Box>
            </Modal>
            <Fab onClick={handleOpenCreate} variant="text" style={{ position: 'absolute', bottom: 10, right: 10 }} size="medium" color="secondary">
                <AddIcon />
            </Fab>
        </div>
    );
}