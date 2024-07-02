import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import {PrimeReactProvider} from 'primereact/api';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { PrivateRoute } from './helpers/RouteMiddleware';
import Dashboard from './pages/Dashboard/Dashboard';
import MasterCustomer from './pages/MasterCustomer/MasterCustomer';
import MasterSales from './pages/MasterSales/MasterSales';
import MasterSalesOrder from './pages/SalesOrder/MasterSalesOrder';
import DetailSalesOrder from './pages/SalesOrder/DetailSalesOrder';
import CreateSalesOrder from './pages/SalesOrder/CreateSalesOrder';
import AddStockSO from './pages/SalesOrder/AddStockSO';


function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-customer'
            element={
              <PrivateRoute>
                <MasterCustomer/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-sales'
            element={
              <PrivateRoute>
                <MasterSales/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-so'
            element={
              <PrivateRoute>
                <MasterSalesOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-so/detail'
            element={
              <PrivateRoute>
                <DetailSalesOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/sales-order'
            element={
              <PrivateRoute>
                <CreateSalesOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/sales-order/create'
            element={
              <PrivateRoute>
                <AddStockSO/>
              </PrivateRoute>
            }  
          />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
