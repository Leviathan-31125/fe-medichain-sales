import React from 'react'
import { BASE_API_SALES, BASE_API_WAREOHUSE } from '../../helpers'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/TableHeader/TableHeader'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import { OnChangeValue } from '../../helpers'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Card } from 'primereact/card'
import { Image } from 'primereact/image'
import { Tag } from 'primereact/tag'

const MasterSales = () => {
    const [listSales, setListSales] = useState([])
    const [listBank, setListBank] = useState([])
    const [loading, setLoading] = useState(false)
    const [dialogConfirm, setDialogConfirm] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [dialogAddUpdate, setDialogAddUpdate] = useState(false)
    const [statusAction, setStatusAction] = useState("CREATE")
    const [errorAttribut, setErrorAttribut] = useState({
      visibility: false, 
      headerTitle: "", 
      errorMessage: ""
    })
    const [detailSales, setDetailSales] = useState({
      fc_salescode: "",
      fc_salestype: "",
      fv_salesname: "",
      fc_saleslevel: "",
      fv_salesphone: "",
      fv_salesemail: "",
      fc_salesbank: "",
      fc_bankaccount: "",
      fc_status: ""
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
  
    const getAllSales = async () => {
      setLoading(true)
      const optionGetData = {
        method: 'get',
        url: `${BASE_API_SALES}/sales`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionGetData)
        .then((response) => {
          setListSales(response.data)
          setLoading(false)
        })
        .catch((error) => {
          setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Load Data",
            errorMessage: error.response.data.message
          })
  
          setLoading(false)
        })
    }

    const getListBank = async () => {
      const optionGetData = {
        method: 'get',
        url: `${BASE_API_SALES}/general/bank`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionGetData)
        .then((response) => {
          setListBank(response.data)
          setLoading(false)
        })
        .catch((error) => {
          setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Load Data",
            errorMessage: error.response.data.message
          })
  
          setLoading(false)
        })
    }
  
    const createSales = async () => {
      setLoading(true)
  
      const optionCreateData = {
        method: 'post',
        url: `${BASE_API_SALES}/sales`,
        data: detailSales,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionCreateData)
        .then((response) => {
          if(response.data.status === 201) {
            setRefresh(!refresh)
            setLoading(false)
            resetData()
          }
        })
        .catch((error) => {
          setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Create",
            errorMessage: error.response.data.message
          })
  
          setLoading(false)
        })
    }
  
    const updateSales = async () => {
      setLoading(true)
      const salesCode = window.btoa(detailSales.fc_salescode)
  
      const optionUpdate = {
        method: 'put',
        url: `${BASE_API_SALES}/sales/${salesCode}`,
        data: detailSales,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionUpdate)
        .then((response) => {
          if(response.data.status === 201) {
            setRefresh(!refresh)
            setLoading(false)
            resetData()
          }
        })
        .catch((error) => {
          setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Update",
            errorMessage: error.response.data.message
          })
  
          setLoading(false)
        })
    }
  
    const deleteSales = async () => {
      setLoading(true)
      setDialogConfirm(false)
      const salesCode = window.btoa(detailSales.fc_salescode)
  
      const optionUpdate = {
        method: 'delete',
        url: `${BASE_API_SALES}/sales/${salesCode}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionUpdate)
        .then(() => {
            setRefresh(!refresh)
            resetData()
            setLoading(false)
        })
        .catch((error) => {
          setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Delete",
            errorMessage: error.response.data.message
          })
  
          setLoading(false)
        })
    }
  
    const saveHandler = () => {
      setDialogAddUpdate(false)
      if (statusAction === "CREATE") createSales()
      if (statusAction === "UPDATE") updateSales()
    }
  
    const resetData = () => { 
      setDetailSales({
        fc_salescode: "",
        fc_salestype: "",
        fv_salesname: "",
        fc_saleslevel: "",
        fv_salesphone: "",
        fv_salesemail: "",
        fc_salesbank: "",
        fc_bankaccount: "",
        fc_status: ""
      })
    }
  
    useEffect(() => {
      getAllSales()
    }, [refresh])

    useEffect(() => {
      getListBank()
    }, [])
  
    const templateDescription = (data) => {
      return data === null ? " - ": data;
    }
  
    const actionBodyTemplate = (data) => (
      <div className="d-flex gap-2">
        <Button className='buttonAction' outlined icon="pi pi-eye" severity='success'/>
        <Button className='buttonAction' icon="pi pi-pencil" severity='primary' onClick={() => showDialog("UPDATE", data)}/>
        <Button className='buttonAction' outlined icon="pi pi-trash" severity='danger' onClick={() => showDialog("DELETE", data)}/>
      </div>
    )
  
    const renderHeader = () => {
      return (
          <TableHeader onGlobalFilterChange={onGlobalFilterChange} labelButton={"Tambah Sales"} 
           globalFilterValue={globalFilterValue} actionButton={() => showDialog("CREATE")} iconHeader={"fas fa-user-tag iconHeader"}/>
      );
    };
  
    const hideDialog = (type) => {
      if (type === "CONFIRM") setDialogConfirm(false)
      if (type === "CREATE" || type === "UPDATE") setDialogAddUpdate(false)
      resetData()
    }
  
    const showDialog = (type, data) => {
      if (data) {
        setDetailSales((currentData) => ({
          ...currentData,
          ...data
        }))
      }
  
      if (type === "CREATE" || type === "UPDATE") {
        if (type === "CREATE") setStatusAction("CREATE")
        else setStatusAction("UPDATE")
        setDialogAddUpdate(true)
      }
  
      if (type === "DELETE") {
        setDetailSales((currentData) => ({
          ...currentData,
          fc_brandcode: data.fc_salescode
        }))
  
        setDialogConfirm(true)
      }
    }
  
    const footerDialogAddUpdate = () => {
      return (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={() => hideDialog("CREATE")} className='mr-3'/>
            <Button label="Save" icon="pi pi-check" onClick={() => saveHandler()}/>
        </React.Fragment>
      )
    }

    const statusTemplate = (data) => {
      return <Tag value={data} severity={data === "ACTIVE" ? "success":"info"}></Tag>
    }
  
    return (
      <PageLayout>
        <Loading visibility={loading}/>
        <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>
        
        <ConfirmDialog visibility={dialogConfirm} submitAction={() => deleteSales()} cancelAction={() => hideDialog("CONFIRM")} confirmMessage={"Yakin ingin menghapus sales ini?"} 
         iconConfirm="pi pi-exclamation-triangle" headerTitle="Hapus Sales" />
        
        <Dialog header="Sales" visible={dialogAddUpdate} style={{ width: '50rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
         onHide={() => hideDialog("UPDATE")} footer={footerDialogAddUpdate}
        >
          <div className='flex-auto mb-3'>
            <label htmlFor="fv_salesname" className='font-bold block mb-2'>Nama Sales</label>
            <InputText id='fv_salesname' name='fv_salesname' value={detailSales.fv_salesname} onChange={(e) => OnChangeValue(e, setDetailSales)} className='w-full' required autoFocus/>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_salesname" className='font-bold block mb-2'>Email Sales</label>
              <InputText id='fv_salesemail' name='fv_salesemail' value={detailSales.fv_salesemail} onChange={(e) => OnChangeValue(e, setDetailSales)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_salesphone" className='font-bold block mb-2'>Telp Sales</label>
              <InputText id='fv_salesphone' name='fv_salesphone' value={detailSales.fv_salesphone} onChange={(e) => OnChangeValue(e, setDetailSales)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_group" className='font-bold block mb-2'>Tipe Sales</label>
              <Dropdown id='fc_salestype' name='fc_salestype' value={detailSales.fc_salestype} options={['EXTERNAL','INTERNAL']} onChange={(e) => OnChangeValue(e, setDetailSales)} 
              className='w-full' placeholder='Pilih Tipe' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_saleslevel" className='font-bold block mb-2'>Tipe Sales</label>
              <Dropdown id='fc_saleslevel' name='fc_saleslevel' value={detailSales.fc_saleslevel} options={['JUNIOR','SENIOR']} onChange={(e) => OnChangeValue(e, setDetailSales)} 
              className='w-full' placeholder='Pilih Level' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_status" className='font-bold block mb-2'>Status</label>
              <Dropdown id='fc_status' name='fc_status' value={detailSales.fc_status} options={['ACTIVE','PASSIVE']} onChange={(e) => OnChangeValue(e, setDetailSales)} 
              className='w-full' placeholder='Pilih Level' required autoFocus/>
            </div>
          </div>

          <hr style={{border: '1px solid black'}}/>

          <div className="flex flex-wrap gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_salesbank" className='font-bold block mb-2'>Bank</label>
              <Dropdown id='fc_salesbank' name='fc_salesbank' value={detailSales.fc_salesbank} options={listBank} optionLabel='fc_information' optionValue='fc_trxcode' onChange={(e) => OnChangeValue(e, setDetailSales)} 
              className='w-full' filter placeholder='Pilih Tipe' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_bankaccount" className='font-bold block mb-2'>No Rekening</label>
              <InputText id='fc_bankaccount' name='fc_bankaccount' value={detailSales.fc_bankaccount} onChange={(e) => OnChangeValue(e, setDetailSales)} className='w-full' required autoFocus/>
            </div>
          </div>

          <hr style={{border: '1px solid black'}}/>

          <div className='flex-auto mb-3'>
            <label htmlFor="ft_description" className='font-bold block mb-2'>Deskripsi</label>
            <InputTextarea id='ft_description' name='ft_description' value={detailSales.ft_description} onChange={(e) => OnChangeValue(e, setDetailSales)} rows={3} className='w-full' required autoFocus/>
          </div>
        </Dialog>
        
        <Card title="Daftar Sales">
          <DataTable value={listSales} tablestyle={{minwidth:'50rem'}} paginator rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_salescode' scrollable header={renderHeader}
            filters={filters} globalFilterFields={['fv_brandname', 'fv_group']} removableSort
          >
            <Column field='fv_salesname' header="Nama Sales" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fc_saleslevel' header="Level" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fc_salestype' header="Tipe" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fc_status' header="Status" body={(data) => statusTemplate(data.fc_status)} sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fv_salesphone' header="Telepon" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fv_salesemail' header="Email" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='bank.fc_information' header="Bank" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fc_bankaccount' header="No Rekening" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '10rem'}}></Column>
            <Column body={actionBodyTemplate} ></Column>
          </DataTable>
        </Card>
      </PageLayout>
    )
}

export default MasterSales
