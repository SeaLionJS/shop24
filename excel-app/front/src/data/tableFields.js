import moment from "moment";

const catalogueColumns = [
    { field: 'id', headerName: 'Код товара', width: 150, editable: false },
    {
      field: 'name',
      headerName: 'Назва товара',
      width: 300,
      editable: true,
    },
    {
      field: 'buy',
      headerName: 'Ціна закупівлі',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'sell',
      headerName: 'Ціна продажу',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'info',
      headerName: 'Нотатки',
      sortable: false,
      width: 300,
      editable: true,
    },
    {
      field: 'date',
      headerName: 'Дата додавання',
      sortable: true,
      width: 250,
      type: 'date',
      valueFormatter: params => 
      moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
  ];


const catalogueColumns2 = [
    { field: 'id', headerName: 'Код товара', width: 150 },
    {
      field: 'name',
      headerName: 'Назва товара',
      width: 250,
      sortable: true,
    },
    {
      field: 'buy',
      headerName: 'Ціна закупівлі',
      type: 'number',
      width: 110,
      sortable: true,
    },
    {
      field: 'sell',
      headerName: 'Ціна продажу',
      type: 'number',
      width: 110,
      sortable: true,
    },
    {
      field: 'info',
      headerName: 'Нотатки',
      sortable: true,
      width: 250,
    },
    {
      field: 'date',
      headerName: 'Дата додавання',
      sortable: true,
      width: 170,
      type: 'date',
    },
  ];

  const columnsSellList = [
    { field: 'id', headerName: 'Код продажу', width: 100 },
    {
      field: 'name',
      headerName: 'Назва товара',
      width: 250,
      sortable: true,
    },
    {
      field: 'sellRec',
      headerName: 'Ціна (каталог)',
      type: 'number',
      width: 150,
      sortable: true,
    },
    {
      field: 'sellReal',
      headerName: 'Ціна продажу',
      type: 'number',
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: 'sellCash',
      headerName: 'Готівка',
      type: 'number',
      width: 100,
      editable: true,
      sortable: true,
    },
    {
      field: 'sellCard',
      headerName: 'Карта',
      type: 'number',
      width: 100,
      sortable: true,
    },
    {
      field: 'date',
      headerName: 'Час',
      sortable: true,
      width: 200,
      valueFormatter: params => 
      moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
  ];

  
  const additionalColumns = [
    { field: 'id', headerName: 'Номер', width: 150 },
    {
      field: 'name',
      headerName: 'Назва товара',
      width: 600,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Сума',
      type: 'number',
      width: 110,
      editable: true,
    },
    
  ];

 export {catalogueColumns, catalogueColumns2, columnsSellList, additionalColumns}