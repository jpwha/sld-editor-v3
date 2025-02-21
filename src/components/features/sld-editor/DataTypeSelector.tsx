import React from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Card } from '../../common/ui/Card';

// Define DataType if not already defined
interface DataType {
  id: string;
  label: string;
  units: { id: string; label: string }[];
  defaultBins: number;
  defaultColors: string[];
}

// Define ColorMapEntry if not already defined
interface ColorMapEntry {
  label: string;
  color: string;
}

const DATA_TYPES: Record<string, DataType> = {
  ROADS: {
    id: 'roads',
    label: 'Roads',
    units: [
      { id: 'km', label: 'Kilometers (km)' },
      { id: 'mi', label: 'Miles (mi)' },
    ],
    defaultBins: 5,
    defaultColors: ['#ff0000', '#00ff00'],
  },
  AREA: {
    id: 'area',
    label: 'Area',
    units: [
      { id: 'km2', label: 'Square Kilometers (km²)' },
      { id: 'acres', label: 'Acres' },
    ],
    defaultBins: 5,
    defaultColors: ['#ffeda0', '#f03b20'],
  },
  PERCENTAGE: {
    id: 'percentage',
    label: 'Percentage',
    units: [{ id: 'percent', label: 'Percent (%)' }],
    defaultBins: 5,
    defaultColors: ['#eff3ff', '#2171b5'],
  },
};

export const DataTypeSelector: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { dataType, selectedUnit } = state;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = DATA_TYPES[e.target.value];
    dispatch(sldEditorActions.setDataType(newType));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = dataType.units.find(u => u.id === e.target.value);
    if (unit) dispatch(sldEditorActions.setUnit(unit));
  };

  return (
    <Card className="mb-4">
      <h2 className="text-lg font-semibold mb-4">Data Type</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={dataType.id}
            onChange={handleTypeChange}
            className="w-full p-2 border rounded"
          >
            {Object.values(DATA_TYPES).map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        {dataType.units.length > 1 && (
          <div>
            <label className="block text-sm font-medium mb-2">Units</label>
            <select
              value={selectedUnit.id}
              onChange={handleUnitChange}
              className="w-full p-2 border rounded"
            >
              {dataType.units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Card>
  );
};