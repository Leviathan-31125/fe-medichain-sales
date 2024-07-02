import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import Loading from '../../components/Loading/Loading'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { BASE_API_SALES, formattedDateWithOutTime } from '../../helpers'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import TableHeader from '../../components/TableHeader/TableHeader'
import { FilterMatchMode } from 'primereact/api'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import './style.css';
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import { Panel } from 'primereact/panel'

const CreateSalesOrder = () => {
  const navigate = useNavigate();

  // dialog handler 
  const [loading, setLoading] = useState(false);
  const [dialogListCustomer, setDialogListCustomer] = useState(false);
  const [dialogCreateSO, setDialogCreateSO] = useState(false);

  // data handler 
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  });
  const [dataCreateSO, setDataCreateSO] = useState({
    fc_sono: localStorage.getItem('userId'),
    fc_salescode: "",
    fc_sotype: "",
    fc_membercode: "",
  });

  // filter primereact 
  const [ filters, setFilters ] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }) 
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = {...filters}

    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  // list data response 
  const [listSales, setListSales] = useState([])
  const [listSOType, setListSOType] = useState([])
  const [listCustomer, setListCustomer] = useState([])
  const [customer, setCustomer] = useState({
    fc_membertaxcode: "",
    fv_membernpwp: "",
    fc_legalstatus: "",
    fv_membername: "",
    fc_branchtype: "",
    fc_typebusiness: "",
    fn_agingreceivable: "",
    fv_npwpaddress: "",
    fm_accountreceivable: ""
  });

  const getDetailSO = async () => {
    setLoading(true);
    const sono = window.btoa(localStorage.getItem('userId'));

    const optionsGet = {
      method: 'get',
      url: `${BASE_API_SALES}/temp-so-mst/${sono}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionsGet)
      .then(() => {
        navigate('/sales-order/create')
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getSales = async () => {
    const optionsGet = {
      method: 'get',
      url: `${BASE_API_SALES}/sales`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionsGet)
      .then((response) => {
        setListSales(response.data);
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Load Data",
          errorMessage: error.response.data.message
        });
        setLoading(false);
      })
  }

  const getSOType = async () => {
    const optionsGet = {
      method: 'get',
      url: `${BASE_API_SALES}/general/so-type`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionsGet)
      .then((response) => {
        setListSOType(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Load Data",
          errorMessage: error.response.data.message
        });
        setLoading(false);
      })
  }

  const getListCustomer = async () => {
    const optionsGet = {
      method: 'get',
      url: `${BASE_API_SALES}/customer`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionsGet)
      .then((response) => {
        setListCustomer(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Load Data",
          errorMessage: error.response.data.message
        });
        setLoading(false);
      })
  }

  const createTempSOMST = async () => {
    setLoading(true)
    setDialogCreateSO(false)

    const optionsCreate = {
      method: 'post',
      url: `${BASE_API_SALES}/temp-so-mst`,
      data: dataCreateSO,
      headers: {
        'Content-Type': "application/json",
        'Authorization': localStorage.getItem("accessToken")
      }
    }

    await axios.request(optionsCreate)
      .then((response) => {
        if (response.data.status === 201)
          navigate('/sales-order/create');
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Load Data",
          errorMessage: error.response.data.message
        });
        setLoading(false);
      })
  }

  useEffect(() => {
    getSales();
    getSOType();
    getListCustomer();
    getDetailSO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeHandler = (event) => {
    const {name, value} = event.target;
  
    setDataCreateSO((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  const chooseCustomer = (data) => {
    setDataCreateSO((currentData) => ({
      ...currentData,
      fc_membercode: data.fc_membercode
    }));

    setCustomer(data);
    setDialogListCustomer(false);
  }

  const showDialogListCustomer = () => {
    setDialogListCustomer(true);
  }

  const renderHeader = () => {
    return (
        <TableHeader 
          onGlobalFilterChange={onGlobalFilterChange}
          globalFilterValue={globalFilterValue} 
          iconHeader={"fas fa-users iconHeader"}
        />
    );
  };

  const actionBodyTemplate = (data) => (
    <Button severity='success' label='Pilih' style={{borderRadius: "10px"}} onClick={()  => chooseCustomer(data)}></Button>
  )

  return (
    <PageLayout>
      <Loading visibility={loading}/>
      <ErrorDialog 
        visibility={errorAttribut.visibility} 
        headerTitle={errorAttribut.headerTitle} 
        errorMessage={errorAttribut.errorMessage}
        setAttribute={setErrorAttribut}
      />
      <Dialog 
        visible={dialogListCustomer} 
        style={{ width: '80rem' }} 
        breakpoints={{ '960px': '80vw', '641px': '90vw' }} 
        header="Daftar Customer"
        onHide={() => setDialogListCustomer(false)}
      >
        <DataTable 
          value={listCustomer}
          tablestyle={{minwidth:'60rem'}}
          paginator scrollable removableSort
          rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
          dataKey='fc_membercode'
          header={renderHeader}  
          filters={filters}
          globalFilterFields={['fv_membername', 'fv_memberalias_name', 'fv_memberaddress', 'fv_membernpwp', 'fc_legalstatus', 'fc_branchtype']}
        >
          <Column field='fc_legalstatus' header="Legalitas" sortable style={{minWidth: '3rem'}}></Column>
          <Column field='fv_membername' header="Nama Customer" sortable style={{minWidth: '13rem'}}></Column>
          <Column field='fv_memberalias_name' header="Nama Alias Customer" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fv_memberaddress' header="Alamat" sortable style={{minWidth: '15rem'}}></Column>
          <Column field='fv_membernpwp' header="NPWP" sortable style={{minWidth: '13rem'}}></Column>
          <Column field='fc_branchtype' header="Status Kantor" sortable style={{minWidth: '8rem'}}></Column>
          <Column body={actionBodyTemplate} style={{minWidth: '7rem'}}></Column>
        </DataTable>
      </Dialog>
      <ConfirmDialog 
        visibility={dialogCreateSO} 
        cancelAction={() => setDialogCreateSO(false)} 
        submitAction={createTempSOMST}
        confirmMessage="Yakin ingin membuat Sales Order ?"
        headerTitle="Buat SO"
      />

      <div className="flex gap-3">
        <Panel 
          header="Info SO" 
          className='cardSo'
          toggleable
        >
          <p>Tanggal : <span>{formattedDateWithOutTime(new Date())}</span></p>
          <div className="row">
            <div className='col-lg-6 col-sm-12 col-12 mb-2'>
              <label htmlFor="fc_salescode" className='font-bold block mb-1'>Sales</label>
              <Dropdown 
                id='fc_salescode'
                name='fc_salescode'
                options={listSales} 
                optionValue='fc_salescode' 
                optionLabel='fv_salesname'
                value={dataCreateSO.fc_salescode} 
                onChange={changeHandler}
                placeholder='Pilih sales'
                className='w-full'
                filter
              />
            </div>
            <div className='col-lg-6 col-sm-12 col-12 mb-2'>
              <label htmlFor="fc_sotype" className='font-bold block mb-1'>Tipe SO</label>
              <Dropdown 
                id='fc_sotype'
                name='fc_sotype'
                options={listSOType}
                optionValue='fc_trxcode'
                optionLabel='fc_information'
                value={dataCreateSO.fc_sotype}
                onChange={changeHandler}
                placeholder='Pilih Type SO'
                className='w-full'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-9 col-sm-12 col-12 mb-2'>
              <label htmlFor="fc_membercode" className='font-bold block mb-1'>Customer</label>
              <div className="p-inputgroup flex-1">
                  <InputText 
                    id='fc_membercode'
                    name='fc_membercode'
                    value={dataCreateSO.fc_membercode} 
                    onChange={changeHandler} 
                    placeholder="Pilih Customer" 
                    disabled
                  />
                  <Button icon="pi pi-search" className="p-button-primary" onClick={() => showDialogListCustomer()} />
              </div>
            </div>
            <div className='col-lg-3 col-sm-12 col-12 mb-2'>
              <label htmlFor="customer.fc_membertaxcode" className='font-bold block mb-1'>Pajak</label>
              <InputText value={customer.fc_membertaxcode} className='w-full' disabled/>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button 
              label='Buat SO' 
              severity='success' 
              className='buttonAction'
              onClick={() => setDialogCreateSO(true)}
            />
          </div>
        </Panel>
        <Panel 
          header="Detail Customer" 
          className='cardCustomer'
          toggleable
        >
          <div className='row'>
            <div className='col-lg-4 col-sm-12 col-12 mb-2'>
              <label htmlFor="customer.fc_npwp" className='font-bold block mb-1'>NPWP</label>
              <InputText value={customer.fv_membernpwp} className='w-full'/>
            </div>
            <div className='col-lg-2 col-sm-3 col-3 mb-2'>
              <label htmlFor="customer.fc_legalstatus" className='font-bold block mb-1'>Legalitas</label>
              <InputText value={customer.fc_legalstatus} className='w-full'/>
            </div>
            <div className='col-lg-6 col-sm-9 col-9 mb-2'>
              <label htmlFor="customer.fv_membername" className='font-bold block mb-1'>Nama Customer</label>
              <InputText value={customer.fv_membername} className='w-full'/>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-3 col-sm-12 col-12 mb-2'>
              <label htmlFor="customer.fc_branchtype" className='font-bold block mb-1'>Status Kantor</label>
              <InputText value={customer.fc_branchtype} className='w-full' disabled/>
            </div>
            <div className='col-lg-4 col-sm-12 col-12 mb-2'>
              <label htmlFor="customer.fc_typebusiness" className='font-bold block mb-1'>Tipe Customer</label>
              <InputText value={customer.fc_typebusiness} className='w-full' disabled/>
            </div>
            <div className='col-lg-5 col-sm-12 col-12 mb-2'>
              <label htmlFor="customer.fn_agingreceivable" className='font-bold block mb-1'>Masa Hutang</label>
              <InputNumber value={customer.fn_agingreceivable} className='w-full' disabled/>
            </div>
          </div>
          <div className="row">
            <div className='col-lg-7 col-sm-9 col-9 mb-lg-0 mb-2'>
              <label htmlFor="customer.fc_memberaddress" className='font-bold block mb-1'>Alamat Customer</label>
              <InputTextarea value={customer.fv_npwpaddress} className='w-full' rows={1}/>
            </div>
            <div className='col-lg-5 col-sm-3 col-3 mb-lg-0 mb-2'>
              <label htmlFor="customer.fm_accountreceivable" className='font-bold block mb-1'>Hutang</label>
              <InputNumber value={customer.fm_accountreceivable} className='w-full' disabled/>
            </div>
          </div>
        </Panel>
      </div>
    </PageLayout>
  )
}

export default CreateSalesOrder
