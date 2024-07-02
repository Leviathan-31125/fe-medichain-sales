import { Card } from 'primereact/card'
import React, {useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { FilterMatchMode } from 'primereact/api'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import axios from 'axios'
import Loading from '../../components/Loading/Loading'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { BASE_API_SALES, getSeverity } from '../../helpers'

const DetailSalesOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dataSO = location.state
  const customer = dataSO.customer
  const [loading, setLoading] = useState(false)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [acceptDialog, setAcceptDialog] = useState(false)
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })

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

  const acceptRequest = async () => {
    setLoading(true)
    setAcceptDialog(false)
    const fc_sono = window.btoa(dataSO.fc_sono)

    const optionUpdateData = {
      method: 'put',
      url: `${BASE_API_SALES}/so-mst/${fc_sono}/accept`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdateData)
      .then(() => {
        navigate('/master-so')
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

  const rejectRequest = async () => {
    setLoading(true)
    setRejectDialog(false)
    const fc_sono = window.btoa(dataSO.fc_sono)

    const optionUpdateData = {
      method: 'put',
      url: `${BASE_API_SALES}/so-mst/${fc_sono}/reject`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdateData)
      .then(() => {
        navigate('/master-so')
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

  const renderHeader = (icon) => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className={icon}></i>
              </div>
              <div className='d-flex'>
                  <IconField className='d-flex align-items-center' iconPosition="left">
                      <InputIcon className="pi pi-search" />
                      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                  </IconField>
              </div>
          </div>
      </div>
    );
  };

  const statusTemplate = (data) => (
    getSeverity("STATUS_BONUS", data)
  )

  const footerAcceptDialog = () => (
    <React.Fragment>
        <Button className='buttonAction' label='Cancel' severity='danger' outlined onClick={() => setAcceptDialog(false)}></Button>
        <Button className='buttonAction ms-2' label='Submit' onClick={() => acceptRequest()}></Button>
    </React.Fragment>
  )

  const footerRejectDialog = () => (
    <React.Fragment>
        <Button className='buttonAction' label='Cancel' severity='danger' outlined onClick={() => setRejectDialog(false)}></Button>
        <Button className='buttonAction ms-2' label='Submit' onClick={() => rejectRequest()}></Button>
    </React.Fragment>
  )
  
  return (
    <PageLayout>
      <Loading visibility={loading}/>

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Dialog visible={acceptDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Accept SO" footer={footerAcceptDialog} onHide={() => ('')}>
        <div className='text-center'>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '10rem', color: 'var(--yellow-300)' }}></i>
            <p style={{fontSize: '22px', fontWeight: '500'}} className='mt-3 mb-0'>Yakin ingin menerima pesanan?</p>
        </div>
      </Dialog>

      <Dialog visible={rejectDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Accept SO" footer={footerRejectDialog} onHide={() => ('')}>
        <div className='text-center'>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '10rem', color: 'var(--yellow-300)' }}></i>
            <p style={{fontSize: '22px', fontWeight: '500'}} className='mt-3 mb-0'>Yakin ingin menolak pesanan?</p>
        </div>
      </Dialog>

      <div className='flex gap-3'>
        <Card className='cardSo'>
          <div className="d-flex gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_sono" className='font-bold block mb-2'>No. SO</label>
              <InputText value={dataSO.fc_sono} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_sono" className='font-bold block mb-2'>Tipe SO</label>
              <InputText value={dataSO.fc_sotype} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_sodate_user" className='font-bold block mb-2'>Tanggal SO</label>
              <InputText value={dataSO.fd_sodate_user} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_soexpired" className='font-bold block mb-2'>Expired SO</label>
              <InputText value={dataSO.fd_soexpired} className='w-full'/>
            </div>
          </div>
        </Card>
        <Card className='cardCustomer'>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_npwp" className='font-bold block mb-2'>NPWP</label>
              <InputText value={customer.fv_membernpwp} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fv_membername" className='font-bold block mb-2'>Nama Customer</label>
              <InputText value={customer.fv_membername} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_legalstatus" className='font-bold block mb-2'>Legalitas</label>
              <InputText value={customer.fc_legalstatus} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_branchtype" className='font-bold block mb-2'>Status Kantor</label>
              <InputText value={customer.fc_branchtype} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_typebusiness" className='font-bold block mb-2'>Tipe Customer</label>
              <InputText value={customer.fc_typebusiness} className='w-full'/>
            </div>
          </div>
        </Card>
      </div>

      <Card className='mt-3'>
        <DataTable value={dataSO.sodtl} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={() => renderHeader("fas fa-boxes iconHeader")} filters={filters} 
          globalFilterFields={['fc_stockcode', 'fv_namestock', 'fv_namealias_stock', 'brand.fv_brandname', 'fc_typestock', 'fc_formstock', 'fc_namepack', 'fn_maxstock', 'fn_minstock', 'fm_purchase', 'fm_sales']}
        >
          <Column field='fn_rownum' header="No" sortable style={{minWidth: '3rem'}}></Column>
          <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '15rem'}}></Column>
          <Column field='stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '15rem'}}></Column>
          <Column field='fc_namepack' header="Satuan" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fn_qty' header="Pesanan" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fn_qty_do' header="Terkirim" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fc_statusbonus' header="Bonus" body={(data) => statusTemplate(data.fc_statusbonus)} style={{minWidth: '8rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" style={{minWidth: '12rem'}}></Column>
        </DataTable>
      </Card>

      <div className='d-flex justify-content-end gap-2 mt-3'>
        <Button className='buttonAction' label='Kembali' severity='info' onClick={() => navigate(-1)}></Button>
        <Button visible={dataSO.fc_status === "REQUEST"} className='buttonAction' label='Reject' severity='danger' onClick={() => setRejectDialog(true)}></Button>
        <Button visible={dataSO.fc_status === "REQUEST"} className='buttonAction' label='Accept' severity='success' onClick={() => setAcceptDialog(true)}></Button>
      </div>
    </PageLayout>
  )
}

export default DetailSalesOrder
