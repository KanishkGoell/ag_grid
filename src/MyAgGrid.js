import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import CustomStatusBar from './CustomStatusBar';
import moment from 'moment';

LicenseManager.setLicenseKey('YOUR_TRIAL_LICENSE_KEY'); // Replace with your trial license key

const MyAgGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [filterPresets, setFilterPresets] = useState({});



const dateComparator = (filterLocalDateAtMidnight, cellValue) => {
    const cellDate = moment(cellValue, 'MM/DD/YYYY').toDate();
    if (cellDate < filterLocalDateAtMidnight) {
        return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
        return 1;
    }
    return 0;
};
    // Function to safely parse numbers, removing $ and commas for salary
    const parseSalary = value => {
        const cleanedValue = value.replace(/[$,]/g, ''); // Remove $ and ,
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? 0 : number; // Replace 0 with any default value you prefer
    };

    // Function to safely parse percentages, removing % symbol
    const parseBonus = value => {
        const cleanedValue = value.replace(/[%]/g, ''); // Remove %
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? 0 : number; // Replace 0 with any default value you prefer
    };

    // Column definitions
    const columnDefs = [
        { field: 'Employee ID', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Full Name', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Job Title', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Department', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Business Unit', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Gender', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Ethnicity', filter: 'agTextColumnFilter', sortable: false },
        { field: 'Age', filter: 'agNumberColumnFilter', sortable: true },
        { field: 'Annual Salary', filter: 'agNumberColumnFilter', sortable: true },
        { field: 'Bonus %', filter: 'agNumberColumnFilter', sortable: true },
        { field: 'Country', filter: 'agTextColumnFilter', sortable: false },
        { field: 'City', filter: 'agTextColumnFilter', sortable: false },
        { 
            field: 'Hire Date', 
            filter: 'agDateColumnFilter', 
            sortable: true, 
            filterParams: { comparator: dateComparator },
            valueGetter: params => moment(params.data['Hire Date'], 'MM/DD/YYYY').toDate(),
            valueFormatter: params => moment(params.value).format('MM/DD/YYYY')
            
        },
        { 
            field: 'Exit Date', 
            filter: 'agDateColumnFilter', 
            sortable: true, 
            filterParams: { comparator: dateComparator },
            valueGetter: params => moment(params.data['Exit Date'], 'MM/DD/YYYY').toDate(),
            valueFormatter: params => moment(params.value).format('MM/DD/YYYY')
        }
    ];

// Fetching data and parsing numbers
useEffect(() => {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const typedData = data.map(item => ({
                ...item,
                Age: parseFloat(item.Age),
                'Annual Salary': parseSalary(item['Annual Salary']),
                'Bonus %': parseBonus(item['Bonus %']),
                // Convert the Date object back to a string in the format 'MM/DD/YYYY'
                'Hire Date': new Date(item['Hire Date']).toLocaleDateString('en-US'),
                'Exit Date': new Date(item['Exit Date']).toLocaleDateString('en-US'),
            }));
            setRowData(typedData);
        })
        .catch(error => console.error('Error loading the data:', error));
}, []);

    // Grid ready event
    const onGridReady = params => {
        setGridApi(params.api);
        const savedFilters = JSON.parse(localStorage.getItem('gridFilters'));
        if (savedFilters) {
            params.api.setFilterModel(savedFilters);
        }
    };

    // Filter change event
    const onFilterChanged = () => {
        if (gridApi) {
            const allFilters = gridApi.getFilterModel();
            localStorage.setItem('gridFilters', JSON.stringify(allFilters));
        }
    };

    // Reset filters
    const resetFilters = () => {
        if (gridApi) {
            gridApi.setFilterModel({});
            localStorage.removeItem('gridFilters');
        }
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        {/* <CustomStatusBar gridApi={gridApi} setFilterPresets={setFilterPresets} filterPresets={filterPresets} /> */}
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true, sortable: true, filter: true }}
                animateRows={true}
                pagination={true}
                paginationPageSize={20}
                onGridReady={onGridReady}
                onFilterChanged={onFilterChanged}
                sideBar={{ toolPanels: ['columns', 'filters'], defaultToolPanel: 'filters' }}
            />
        </div>
    );
};

export default MyAgGrid;
