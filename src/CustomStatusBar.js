import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomStatusBar.css';

const CustomStatusBar = ({ gridApi }) => {
    const [newPresetName, setNewPresetName] = useState('');
    const [filterPresets, setFilterPresets] = useState({});

    useEffect(() => {
        // Fetch filter presets from backend
        axios.get('http://localhost:5000/api/filter-presets')
            .then(response => setFilterPresets(response.data))
            .catch(error => console.error('Error fetching filter presets:', error));
    }, []);

    const resetFilters = () => {
        if (gridApi) {
            gridApi.setFilterModel({});
        }
    };

    const saveFilterPreset = () => {
        if (gridApi && newPresetName) {
            const currentFilters = gridApi.getFilterModel();
            const updatedFilterPresets = { ...filterPresets, [newPresetName]: currentFilters };
            setFilterPresets(updatedFilterPresets);
            setNewPresetName('');

            // Save filter presets to backend
            axios.post('http://localhost:5000/api/filter-presets', updatedFilterPresets)
                .then(response => console.log(response.data.message))
                .catch(error => console.error('Error saving filter presets:', error));
        }
    };

    const applyFilterPreset = (presetName) => {
        if (gridApi && presetName in filterPresets) {
            gridApi.setFilterModel(filterPresets[presetName]);
        }
    };

    return (
        <div className="status-bar">
            <select className="status-bar-select" onChange={e => applyFilterPreset(e.target.value)}>
                <option>Select a filter preset</option>
                {Object.keys(filterPresets).map(presetName => (
                    <option key={presetName} value={presetName}>{presetName}</option>
                ))}
            </select>
            <input 
                className="status-bar-input"
                value={newPresetName} 
                onChange={e => setNewPresetName(e.target.value)} 
                placeholder="New preset name" 
            />
            <button className="status-bar-button" onClick={saveFilterPreset}>Save current filters as preset</button>
            <button className="status-bar-button" onClick={resetFilters}>Reset Filters</button>
        </div>
    );
};

export default CustomStatusBar;
