import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import React from 'react'

const TableHeader = ({globalFilterValue, onGlobalFilterChange, iconHeader, titleHeader}) => {
  return (
    <div>
        <div className="searchBarLayout">
            <div className="cardHeader">
              <i className={iconHeader}></i>
              <p className='p-0 m-0'>{titleHeader}</p>
            </div>
            <div className='d-flex'>
                <IconField className='d-flex align-items-center' iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        </div>
    </div>
  )
}

export default TableHeader
