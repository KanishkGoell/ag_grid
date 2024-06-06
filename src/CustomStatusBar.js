import React, { useState, useEffect } from 'react';
import './CustomStatusBar.css'; // Ensure you have a corresponding CSS file

const CustomStatusBar = ({ gridApi }) => {
    const [newPresetName, setNewPresetName] = useState('');
    const [filterPresets, setFilterPresets] = useState(JSON.parse(sessionStorage.getItem('filterPresets')) || {});

    useEffect(() => {
        sessionStorage.setItem('filterPresets', JSON.stringify(filterPresets));
    }, [filterPresets]);

    const resetFilters = () => {
        if (gridApi) {
            gridApi.setFilterModel({});
            sessionStorage.removeItem('gridFilters');
        }
    };

    const saveFilterPreset = () => {
        if (gridApi && newPresetName) {
            const currentFilters = gridApi.getFilterModel();
            setFilterPresets({ ...filterPresets, [newPresetName]: currentFilters });
            setNewPresetName('');
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
