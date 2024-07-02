import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState, useEffect } from 'react'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import Loading from '../../components/Loading/Loading'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { InputText } from 'primereact/inputtext'
import { InputIcon } from 'primereact/inputicon'
import { IconField } from 'primereact/iconfield'
import { FilterMatchMode } from 'primereact/api'
import axios from 'axios'
import { BASE_API_SALES, formatDateToDB, formatIDRCurrency, getSeverity } from '../../helpers'
import { Button } from 'primereact/button'
import { Tab, Tabs } from 'react-bootstrap'
import styles from './style.module.css';
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'

const MasterSalesOrder = () => {
  const navigate = useNavigate()
  const [listMasterSO, setListMasterSO] = useState([])
  const [listMasterSOReq, setListMasterSOReq] = useState([])
  const [listMasterSOReject, setListMasterSOReject] = useState([])
  const [loading, setLoading] = useState(false)
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

  const getAllMasterSO = async () => {
    setLoading(true)

    const optionGetData = {
      method: 'get',
      url: `${BASE_API_SALES}/so-mst`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        const listSOReq = []
        const listSOReject = []
        const listSO  = []
        response.data.map((so) => {
          if (so.fc_status === "REQUEST")
            listSOReq.push(so);
          else if (so.fc_status === "REJECT")
            listSOReject.push(so)
          else
            listSO.push(so)

          return so
        })

        setListMasterSO(listSO)
        setListMasterSOReq(listSOReq)
        setListMasterSOReject(listSOReject)
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

  useEffect(() => {
    getAllMasterSO()
  }, [])

  const templateDescription = (data) => {
    return data === null ? " - ": data;
  }

  const actionBodyTemplate = (data) => (
    <div className="d-flex gap-2">
      <Button className='buttonAction' outlined icon="pi pi-eye" severity='success' onClick={() => navigate('/master-so/detail', {state: data})}/>
    </div>
  )

  const renderHeader = () => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className="fas fa-clipboard-list iconHeader"></i>
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

  const statusTemplate = (rowdata) => (
    <Tag value={rowdata} severity={getSeverity("STATUS", rowdata)}></Tag>
  )

  return (
    <PageLayout>
      <Loading visibility={loading}/>
      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>
      
      <Card title="Daftar Customer">
        <Tabs defaultActiveKey={0} className={styles.myTabs}>
          <Tab eventKey={0} title="Daftar Sales Order">
            <DataTable value={listMasterSO} tablestyle={{minwidth:'70rem'}} paginator rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_sono' scrollable header={renderHeader}
              filters={filters} globalFilterFields={['fc_sono', 'customer.fv_membername', 'fd_sodate_user', 'fc_status', 'sales.fv_salesname', 'fm_brutto']} 
              removableSort
            >
              <Column field='fc_sono' header="No. SO" sortable style={{minWidth: '10rem'}}></Column>
              <Column field='fc_sotype' header="Tipe SO" sortable style={{minWidth: '8rem'}}></Column>
              <Column field='customer.fv_membername' header="Nama Customer" style={{minWidth: '15rem'}}></Column>
              <Column field='fd_sodate_user' header="Tanggal SO" body={(data) => formatDateToDB(data.fd_sodate_user)} style={{minWidth: '10rem'}}></Column>
              <Column field='fd_soexpired' header="Expired SO"  body={(data) => formatDateToDB(data.fd_soexpired)} style={{minWidth: '10rem'}}></Column>
              <Column field='fc_status' header="Status SO" body={(data) => statusTemplate(data.fc_status)} style={{minWidth: '8rem'}}></Column>
              <Column field='sales.fv_salesname' header="Sales" style={{maxWidth: '10rem'}}></Column>
              <Column field='fn_sodetail' header="Item" style={{maxWidth: '8rem'}}></Column>
              <Column field='fm_netto' header="Total" body={(data) => formatIDRCurrency(data.fm_netto)} style={{maxWidth: '10rem'}}></Column>
              <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '12rem'}}></Column>
              <Column body={actionBodyTemplate} ></Column>
            </DataTable>
          </Tab>
          <Tab eventKey={1} title="Daftar Request Order">
            <DataTable value={listMasterSOReq} tablestyle={{minwidth:'70rem'}} paginator rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_sono' scrollable header={renderHeader}
              filters={filters} globalFilterFields={['fc_sono', 'customer.fv_membername', 'fd_sodate_user', 'fc_status', 'sales.fv_salesname', 'fm_brutto']} 
              removableSort
            >
              <Column field='fc_sono' header="No. SO" sortable style={{minWidth: '10rem'}}></Column>
              <Column field='fc_sotype' header="Tipe SO" sortable style={{minWidth: '8rem'}}></Column>
              <Column field='customer.fv_membername' header="Nama Customer" style={{minWidth: '15rem'}}></Column>
              <Column field='fd_sodate_user' header="Tanggal SO" body={(data) => formatDateToDB(data.fd_sodate_user)} style={{minWidth: '10rem'}}></Column>
              <Column field='fd_soexpired' header="Expired SO"  body={(data) => formatDateToDB(data.fd_soexpired)} style={{minWidth: '10rem'}}></Column>
              <Column field='fc_status' header="Status SO" body={(data) => statusTemplate(data.fc_status)} style={{minWidth: '8rem'}}></Column>
              <Column field='sales.fv_salesname' header="Sales" body={() => "Mandiri"} style={{maxWidth: '10rem'}}></Column>
              <Column field='fn_sodetail' header="Item" style={{maxWidth: '8rem'}}></Column>
              <Column field='fm_netto' header="Total" body={(data) => formatIDRCurrency(data.fm_netto)} style={{maxWidth: '10rem'}}></Column>
              <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '12rem'}}></Column>
              <Column body={actionBodyTemplate} ></Column>
            </DataTable>
          </Tab>
          <Tab eventKey={2} title="Reject Request Order">
            <DataTable value={listMasterSOReject} tablestyle={{minwidth:'70rem'}} paginator rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_sono' scrollable header={renderHeader}
              filters={filters} globalFilterFields={['fc_sono', 'customer.fv_membername', 'fd_sodate_user', 'fc_status', 'sales.fv_salesname', 'fm_brutto']} 
              removableSort
            >
              <Column field='fc_sono' header="No. SO" sortable style={{minWidth: '10rem'}}></Column>
              <Column field='fc_sotype' header="Tipe SO" sortable style={{minWidth: '8rem'}}></Column>
              <Column field='customer.fv_membername' header="Nama Customer" style={{minWidth: '15rem'}}></Column>
              <Column field='fd_sodate_user' header="Tanggal SO" body={(data) => formatDateToDB(data.fd_sodate_user)} style={{minWidth: '10rem'}}></Column>
              <Column field='fd_soexpired' header="Expired SO"  body={(data) => formatDateToDB(data.fd_soexpired)} style={{minWidth: '10rem'}}></Column>
              <Column field='fc_status' header="Status SO" body={(data) => statusTemplate(data.fc_status)} style={{minWidth: '8rem'}}></Column>
              <Column field='sales.fv_salesname' header="Sales" body={() => "Mandiri"} style={{maxWidth: '10rem'}}></Column>
              <Column field='fn_sodetail' header="Item" style={{maxWidth: '8rem'}}></Column>
              <Column field='fm_netto' header="Total" body={(data) => formatIDRCurrency(data.fm_netto)} style={{maxWidth: '10rem'}}></Column>
              <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '12rem'}}></Column>
              <Column body={actionBodyTemplate} ></Column>
            </DataTable>
          </Tab>
        </Tabs>
      </Card>
    </PageLayout>
  )
}

export default MasterSalesOrder
