import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import '../styles/App.css';
import shopListRequests from '../requests/shopListRequests.js'
import functionUtils from '../utils/functionUtils.js'
import localizedComponents from '../utils/localizedComponents.js'

export function Shop() {
    const [t] = useTranslation();
    const [elements, setElements] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [shopItemName, setShopItemName] = useState('');
    const [shopItemBasicInfo, setShopItemBasicInfo] = useState('');
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [shopItemPrice, setShopItemPrice] = useState(0);
    const [shopItemCurrency, setShopItemCurrency] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const columns = [
        { field: 'article_name', headerName: 'Item Name', width: 200 },
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
                    // onClick={duplicateUser(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    // onClick={contactListRequests.deleteContact(params.id)}
                    showInMenu
                />,
            ],
        }
    ]

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function loadShopList() {
        shopListRequests.getShopItemsList().then(result => {
            setElements(result)
            setIsLoaded(true)
        }, error => {
            setIsLoaded(true)
            console.log(error)
        });
    }

    function createShopItem() {
        const requestBody = {
            'body': {
                'article_name': shopItemName,
                'basic_info': shopItemBasicInfo,
                'number_of_items': numberOfItems,
                'price': shopItemPrice,
                'currency': shopItemCurrency
            }
        }
        shopListRequests.insertShopItem(JSON.stringify(requestBody));
        setOpen(false);
        loadShopList();
    }

    useEffect(() => {
        loadShopList();
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div>
                    <Button onClick={handleOpen}> {t('add_new_shop_item_button')} </Button>
                </div>
                <div style={{ height: 600, width: '100%', background: 'white' }}>
                    <DataGrid
                        rows={elements}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        localeText={localizedComponents.DatagridLocales}
                    />
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-content"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('create_new_shop_item_title')}
                        </Typography>
                        <div id="modal-modal-content">
                            <div id="article_name_input" style={{ height: 100 }}>
                                <TextField fullWidth id='article_name' placeholder='Item name' value={shopItemName} onChange={functionUtils.handleSetInput(setShopItemName)}></TextField>
                            </div>
                            <div id="basic_info_input" style={{ height: 100 }}>
                                <TextField fullWidth id='basic_info' placeholder='Basic information' value={shopItemBasicInfo} onChange={functionUtils.handleSetInput(setShopItemBasicInfo)}></TextField>
                            </div>
                            <div id="number_of_items_input" style={{ height: 100 }}>
                                <TextField fullWidth id='number_of_items' placeholder='Number of Items' value={numberOfItems} onChange={functionUtils.handleSetInput(setNumberOfItems)}></TextField>
                            </div>
                            <div id="price_input" style={{ height: 100 }}>
                                <TextField fullWidth id='price' placeholder='Price' value={shopItemPrice} onChange={functionUtils.handleSetInput(setShopItemPrice)}></TextField>
                            </div>
                            <div id="currency_input" style={{ height: 100 }}>
                                <TextField fullWidth id='currency' placeholder='Currency' value={shopItemCurrency} onChange={functionUtils.handleSetInput(setShopItemCurrency)}></TextField>
                            </div>
                            <div id="crate_btn">
                                <Button onClick={createShopItem}>Create</Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }
}