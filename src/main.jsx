import React from 'react'
import { createRoot } from 'react-dom/client'
import MonthlyBillGenerator from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MonthlyBillGenerator />
  </React.StrictMode>
)
