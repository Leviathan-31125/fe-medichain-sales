import React from 'react'
import { BASE_API_SALES } from '../../helpers'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/TableHeader/TableHeaderButton'
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
import { InputNumber } from 'primereact/inputnumber'
import { Card } from 'primereact/card'
import { InputTextarea } from 'primereact/inputtextarea'

const MasterCustomer = () => {
    const [listCustomer, setListCustomer] = useState([])
    const [listTypeCustomer, setListTypeCustomer] = useState([])
    const [listPPH, setListPPH] = useState([])
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
    const [detailCustomer, setDetailCustomer] = useState({
      fc_membercode: "",
      fv_membernpwp: "",
      fv_membername: "",
      fv_memberalias_name: "",
      fv_memberaddress: "",
      fv_memberaddress_loading: "",
      fc_picname1: "",
      fv_memberphone1: "",
      fc_typebusiness: "",
      fc_legalstatus: "",
      fc_branchtype: "",
      fc_membertaxcode: "",
      fc_memberpph: "",
      fv_npwpname: "",
      fv_npwpaddress: "",
      fm_doplaffon: 0,
      fn_agingreceivable: 30,
      fc_memberbank: "",
      fc_bankaccount: "",
      ft_description: ""
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
  
    const getAllCustomer = async () => {
      setLoading(true)

      const optionGetCustomer = {
        method: 'get',
        url: `${BASE_API_SALES}/customer`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionGetCustomer)
        .then((response) => {
          setListCustomer(response.data)
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
    
    const getTypeCustomer = async () => {
      const optionGetData = {
        method: 'get',
        url: `${BASE_API_SALES}/general/cust-type`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionGetData)
        .then((response) => {
          setListTypeCustomer(response.data)
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

    const getListPPH = async () => {
      const optionGetData = {
        method: 'get',
        url: `${BASE_API_SALES}/general/pph-type`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionGetData)
        .then((response) => {
          setListPPH(response.data)
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
  
    const createCustomer = async () => {
      setLoading(true)
  
      const optionCreateCustomer = {
        method: 'post',
        url: `${BASE_API_SALES}/customer`,
        data: detailCustomer,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionCreateCustomer)
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
  
    const updateCustomer = async () => {
      setLoading(true)
      const memberCode = window.btoa(detailCustomer.fc_membercode)
  
      const optionUpdate = {
        method: 'put',
        url: `${BASE_API_SALES}/customer/${memberCode}`,
        data: detailCustomer,
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
  
    const deleteCustomer = async () => {
      setLoading(true)
      setDialogConfirm(false)
      const memberCode = window.btoa(detailCustomer.fc_membercode)
  
      const optionDelete = {
        method: 'delete',
        url: `${BASE_API_SALES}/customer/${memberCode}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  
      await axios.request(optionDelete)
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
      if (statusAction === "CREATE") createCustomer()
      if (statusAction === "UPDATE") updateCustomer()
    }
  
    const resetData = () => { 
      setDetailCustomer({
        fc_membercode: "",
        fv_membernpwp: "",
        fv_membername: "",
        fv_memberalias_name: "",
        fv_memberaddress: "",
        fv_memberaddress_loading: "",
        fc_picname1: "",
        fv_memberphone1: "",
        fc_typebusiness: "",
        fc_legalstatus: "",
        fc_branchtype: "",
        fc_membertaxcode: "",
        fc_memberpph: "",
        fv_npwpname: "",
        fv_npwpaddress: "",
        fm_doplaffon: 0,
        fn_agingreceivable: 30,
        fc_memberbank: "",
        fc_bankaccount: "",
        ft_description: ""
      })
    }
  
    useEffect(() => {
      getAllCustomer()
    }, [refresh])

    useEffect(() => {
      getTypeCustomer()
      getListBank()
      getListPPH()
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
          <TableHeader onGlobalFilterChange={onGlobalFilterChange} labelButton={"Tambah Customer"} 
           globalFilterValue={globalFilterValue} actionButton={() => showDialog("CREATE")} iconHeader={"fas fa-users iconHeader"}/>
      );
    };
  
    const hideDialog = (type) => {
      if (type === "CONFIRM") setDialogConfirm(false)
      if (type === "CREATE" || type === "UPDATE") setDialogAddUpdate(false)
      resetData()
    }
  
    const showDialog = (type, data) => {
      if (data) {
        setDetailCustomer((currentData) => ({
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
        setDetailCustomer((currentData) => ({
          ...currentData,
          fc_membercode: data.fc_membercode
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
  
    return (
      <PageLayout>
        <Loading visibility={loading}/>
        <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>
        
        <ConfirmDialog visibility={dialogConfirm} submitAction={() => deleteCustomer()} cancelAction={() => hideDialog("CONFIRM")} confirmMessage={"Yakin ingin menghapus Customer ini?"} 
         iconConfirm="pi pi-exclamation-triangle" headerTitle="Hapus Customer" />
        
        <Dialog header="Customer" visible={dialogAddUpdate} style={{ width: '60rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
         onHide={() => hideDialog("UPDATE")} footer={footerDialogAddUpdate}
        >
          <div className='flex flex-wrap gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_brandname" className='font-bold block mb-2'>Legalitas</label>
              <Dropdown id='fc_legalstatus' options={['PT', 'CV', 'BUMN']} name='fc_legalstatus' value={detailCustomer.fc_legalstatus} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_membername" className='font-bold block mb-2'>Nama Customer</label>
              <InputText id='fv_membername' name='fv_membername' value={detailCustomer.fv_membername} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_memberalias_name" className='font-bold block mb-2'>Nama Alias</label>
              <InputText id='fv_memberalias_name' name='fv_memberalias_name' value={detailCustomer.fv_memberalias_name} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_branchtype" className='font-bold block mb-2'>Status Customer</label>
              <Dropdown id='fc_branchtype' options={['BRANCH', 'HEAD OFFICE']} name='fc_branchtype' placeholder='Pilih Status' value={detailCustomer.fc_branchtype} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_typebusiness" className='font-bold block mb-2'>Tipe</label>
              <Dropdown id='fc_typebusiness' options={listTypeCustomer} optionLabel='fc_trxcode' optionValue='fc_trxcode' placeholder='Pilih Tipe' name='fc_typebusiness' value={detailCustomer.fc_typebusiness} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fv_memberaddress" className='font-bold block mb-2'>Alamat</label>
            <InputTextarea id='fv_memberaddress' name='fv_memberaddress' value={detailCustomer.fv_memberaddress} onChange={(e) => OnChangeValue(e, setDetailCustomer)} rows={3} className='w-full' required autoFocus/>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fv_memberaddress_loading" className='font-bold block mb-2'>Alamat Pengiriman</label>
            <InputTextarea id='fv_memberaddress_loading' name='fv_memberaddress_loading' value={detailCustomer.fv_memberaddress_loading} onChange={(e) => OnChangeValue(e, setDetailCustomer)} rows={3} className='w-full' required autoFocus/>
          </div>

          <div className='flex flex-wrap gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_picname1" className='font-bold block mb-2'>Nama PIC</label>
              <InputText id='fc_picname1' name='fc_picname1' value={detailCustomer.fc_picname1} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_memberphone1" className='font-bold block mb-2'>Telp PIC</label>
              <InputText id='fv_memberphone1' name='fv_memberphone1' value={detailCustomer.fv_memberphone1} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_membertaxcode" className='font-bold block mb-2'>Pajak</label>
              <Dropdown id='fc_membertaxcode' name='fc_membertaxcode' options={['PPN', 'NON']} placeholder='Pilih Jenis Pajak' value={detailCustomer.fc_membertaxcode} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_memberpph" className='font-bold block mb-2'>PPH</label>
              <Dropdown id='fc_memberpph' name='fc_memberpph' options={listPPH} optionLabel='fc_trxcode' optionValue='fc_trxcode' placeholder='Pilih Jenis PPH' value={detailCustomer.fc_memberpph} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_memberbank" className='font-bold block mb-2'>Bank</label>
              <Dropdown id='fc_memberbank' options={listBank} filter optionLabel='fc_information' optionValue='fc_trxcode' placeholder='Pilih Bank' name='fc_memberbank' value={detailCustomer.fc_memberbank} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_bankaccount" className='font-bold block mb-2'>No Rekening</label>
              <InputText id='fc_bankaccount' name='fc_bankaccount' value={detailCustomer.fc_bankaccount} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <hr style={{border: '1px solid black'}} />

          <div className="flex flex-wrap gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_membernpwp" className='font-bold block mb-2'>NPWP - No</label>
              <InputText id='fv_membernpwp' name='fv_membernpwp' value={detailCustomer.fv_membernpwp} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_npwpname" className='font-bold block mb-2'>NPWP - Nama</label>
              <InputText id='fv_npwpname' name='fv_npwpname' value={detailCustomer.fv_npwpname} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
            </div>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fv_npwpaddress" className='font-bold block mb-2'>NPWP - Alamat</label>
            <InputText id='fv_npwpaddress' name='fv_npwpaddress' value={detailCustomer.fv_npwpaddress} onChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fm_doplaffon" className='font-bold block mb-2'>Plaffon/INV</label>
              <InputNumber id='fm_doplaffon' name='fm_doplaffon' value={detailCustomer.fm_doplaffon} onValueChange={(e) => OnChangeValue(e, setDetailCustomer)} mode='currency' currency='IDR' locale='id-ID' className='w-full' required autoFocus/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fn_agingreceivable" className='font-bold block mb-2'>Max. Masa Hutang</label>
              <div className="p-inputgroup flex-1">
                  <InputNumber id='fn_agingreceivable' name='fn_agingreceivable' value={detailCustomer.fn_agingreceivable} onValueChange={(e) => OnChangeValue(e, setDetailCustomer)} className='w-full' required autoFocus/>
                  <span className="p-inputgroup-addon">HARI</span>
              </div>
            </div>
          </div>

          <hr style={{border: '1px solid black'}} />

          <div className='flex-auto mb-3'>
            <label htmlFor="ft_description" className='font-bold block mb-2'>Deskripsi</label>
            <InputTextarea id='ft_description' name='ft_description' value={detailCustomer.ft_description} onChange={(e) => OnChangeValue(e, setDetailCustomer)} rows={3} className='w-full' required autoFocus/>
          </div>
        </Dialog>
        
        <Card title="Daftar Customer">
          <DataTable value={listCustomer} tablestyle={{minwidth:'70rem'}} paginator rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_membercode' scrollable header={renderHeader}
            filters={filters} globalFilterFields={['fv_membernpwp', 'fv_membername', 'fv_memberalias_name', 'fv_memberaddress', 'bank.fc_information', 'fc_bankaccount']} 
            removableSort
          >
            <Column field='fv_membernpwp' header="NPWP" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fv_membername' header="Nama Customer" sortable style={{minWidth: '15rem'}}></Column>
            <Column field='fv_memberalias_name' header="Nama Alias" style={{maxWidth: '15rem'}}></Column>
            <Column field='fv_memberaddress' header="Alamat" style={{minWidth: '15rem'}}></Column>
            <Column field='fv_memberaddress_loading' header="Alamat Pengiriman" style={{minWidth: '15rem'}}></Column>
            <Column field='fc_picname1' header="PIC" style={{maxWidth: '10rem'}}></Column>
            <Column field='fv_memberphone1' header="Telp PIC" style={{maxWidth: '8rem'}}></Column>
            <Column field='fc_typebusiness' header="Tipe" style={{minWidth: '8rem'}}></Column>
            <Column field='fc_legalstatus' header="Legalitas" style={{minWidth: '5rem'}}></Column>
            <Column field='fc_branchtype' header="Status Perusahaan" style={{minWidth: '15rem'}}></Column>
            <Column field='fc_membertaxcode' header="Pajak" style={{maxWidth: '5rem'}}></Column>
            <Column field='fc_memberpph' header="PPH" style={{maxWidth: '5rem'}}></Column>
            <Column field='fv_npwpname' header="Nama NPWP" style={{minWidth: '15rem'}}></Column>
            <Column field='fv_npwpaddress' header="Alamat NPWP" style={{minWidth: '15rem'}}></Column>
            <Column field='fm_doplaffon' header="Limit/INV" style={{maxWidth: '10rem'}}></Column>
            <Column field='fn_agingreceivable' header="Batas Hutang" style={{minWidth: '8rem'}}></Column>
            <Column field='bank.fc_information' header="Bank" style={{minWidth: '10rem'}}></Column>
            <Column field='fc_bankaccount' header="No. Rekening" style={{minWidth: '10rem'}}></Column>
            <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '10rem'}}></Column>
            <Column body={actionBodyTemplate} ></Column>
          </DataTable>
        </Card>
      </PageLayout>
    )
}

export default MasterCustomer
