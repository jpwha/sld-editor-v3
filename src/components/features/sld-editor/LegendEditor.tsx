import React from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Button } from '../../common/ui/Button';

export const LegendEditor: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { entries, editableLegend } = state;

  const handleReverseOrder = () => {
    dispatch(sldEditorActions.setEntries([...entries].reverse()));
  };

  const handleReverseRangeDisplay = () => {
    const newEntries = entries.map(entry => {
      if (entry.label.includes('Missing')) return entry;
      const [start, end] = entry.label.split(' - ').map(s => s.replace('%', ''));
      const newLabel = editableLegend.displayAsPercentage
        ? editableLegend.reverseRangeDisplay
          ? `${start}% - ${end}%`
          : `${end}% - ${start}%`
        : editableLegend.reverseRangeDisplay
          ? `${end} - ${start}`
          : `${start} - ${end}`;
      return { ...entry, label: newLabel, baseLabel: newLabel };
    });
    dispatch(sldEditorActions.setEntries(newEntries));
    dispatch(sldEditorActions.updateLegend({ reverseRangeDisplay: !editableLegend.reverseRangeDisplay }));
  };

  const handleDecimalPlacesChange = (value: string) => {
    const decimalPlaces = Math.max(0, Math.min(6, parseInt(value) || 0));
    const newEntries = entries.map(entry => {
      if (entry.label.includes('Missing')) return entry;
      const [start, end] = entry.label.split(' - ').map(Number);
      const newLabel = editableLegend.reverseRangeDisplay
        ? `${end.toFixed(decimalPlaces)} - ${start.toFixed(decimalPlaces)}`
        : `${start.toFixed(decimalPlaces)} - ${end.toFixed(decimalPlaces)}`;
      return { ...entry, label: newLabel, baseLabel: newLabel };
    });
    dispatch(sldEditorActions.setEntries(newEntries));
    dispatch(sldEditorActions.updateLegend({ decimalPlaces }));
  };

  const handleTogglePercentage = () => {
    const newDisplayAsPercentage = !editableLegend.displayAsPercentage;
    const newEntries = entries.map((entry, i) => {
      if (entry.label.includes('Missing')) return entry;
      const numBins = entries.filter(e => !e.label.includes('Missing')).length;
      const label = newDisplayAsPercentage
        ? `${(i * 100 / numBins).toFixed(editableLegend.decimalPlaces)}% - ${((i + 1) * 100 / numBins).toFixed(editableLegend.decimalPlaces)}%`
        : `${parseFloat(entry.quantity).toFixed(editableLegend.decimalPlaces)} - ${(parseFloat(entry.quantity) + 1).toFixed(editableLegend.decimalPlaces)}`;
      return { ...entry, label, baseLabel: label };
    });
    dispatch(sldEditorActions.setEntries(newEntries));
    dispatch(sldEditorActions.updateLegend({ displayAsPercentage: newDisplayAsPercentage }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button onClick={handleReverseOrder}>Reverse Order</Button>
        <Button onClick={handleReverseRangeDisplay}>Reverse Range Display</Button>
        <div className="flex items-center gap-2">
          <label className="text-sm">Decimal Places:</label>
          <input
            type="number"
            min="0"
            max="6"
            value={editableLegend.decimalPlaces}
            onChange={e => handleDecimalPlacesChange(e.target.value)}
            className="w-16 p-1 border rounded text-sm"
          />
        </div>
        <Button onClick={handleTogglePercentage}>
          {editableLegend.displayAsPercentage ? 'Show Raw Values' : 'Show Percentages'}
        </Button>
      </div>
    </div>
  );
};