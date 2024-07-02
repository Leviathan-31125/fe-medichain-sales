import React from 'react'
import './SideBar.css'
import { LogoMedichain } from '../../assets';
import { useLocation, useNavigate } from 'react-router-dom'

const SideBar = () => {
    const location = useLocation();
    const currentLocation = location.pathname.split('/')[1];
    const navigate = useNavigate();

    const userLogout = () => {
        setTimeout(() => {
            localStorage.removeItem('accessToken')
            navigate('/')
        }, 200)
    }

    return (
        <div className='sideBar' name="sideBar">
            <img src={LogoMedichain} alt="Logo-Medichain" height="60px" />
            <div className='sidebarMenu'>
                <a href="/dashboard">
                    <div className={currentLocation === "dashboard" ? "activeMenu" : "inactiveMenu"}>Dashboard</div>
                </a>
                <a href="/master-customer">
                    <div className={currentLocation === "master-customer" ? "activeMenu" : "inactiveMenu"}>Master Customer</div>
                </a>
                <a href="/master-sales">
                    <div className={currentLocation === "master-sales" ? "activeMenu" : "inactiveMenu"}>Master Sales</div>
                </a>
                <a href="/master-so">
                    <div className={currentLocation === "master-so" ? "activeMenu" : "inactiveMenu"}>Daftar SO</div>
                </a>
                <a href="/sales-order">
                    <div className={currentLocation === "sales-order" ? "activeMenu" : "inactiveMenu"}>Sales Order</div>
                </a>
            </div>
            <div className='logoutContainer'>
                <button className="logoutButton" onClick={userLogout}>Logout</button>
            </div>
        </div>

    )
}

export default SideBar
