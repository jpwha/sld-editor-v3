// src/components/features/sld-editor/OrderingPanel.tsx
import React from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Card } from '../../common/ui/Card';
import { Button } from '../../common/ui/Button';

export const OrderingPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state, dispatch } = useSldEditorContext();
  const { entries } = state;

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const newEntries = [...entries];
    if (direction === 'up' && index > 0) {
      [newEntries[index], newEntries[index - 1]] = [newEntries[index - 1], newEntries[index]];
    } else if (direction === 'down' && index < entries.length - 1) {
      [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];
    }
    dispatch(sldEditorActions.setEntries(newEntries));
  };

  const reverseOrder = () => {
    dispatch(sldEditorActions.setEntries([...entries].reverse()));
  };

  const sortByLabel = () => {
    const newEntries = [...entries].sort((a, b) => {
      const numA = parseFloat(a.label);
      const numB = parseFloat(b.label);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.label.localeCompare(b.label);
    });
    dispatch(sldEditorActions.setEntries(newEntries));
  };

  return (
    <Card className={`h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Reorder Labels</h3>
        <div className="flex gap-2">
          <Button onClick={sortByLabel}>Sort</Button>
          <Button onClick={reverseOrder}>Reverse</Button>
        </div>
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600 bg-gray-100 p-2 rounded">
          <div className="col-span-1">Color</div>
          <div className="col-span-2">Label</div>
          <div className="col-span-1">Quantity</div>
          <div className="col-span-1">Actions</div>
        </div>
        {entries.map((entry, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            <div className="col-span-1 flex items-center">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }} />
            </div>
            <div className="col-span-2">
              <span>{entry.label}</span>
            </div>
            <div className="col-span-1">
              <span>{entry.quantity}</span>
            </div>
            <div className="col-span-1 flex gap-1 justify-end">
              <Button
                onClick={() => moveEntry(index, 'up')}
                disabled={index === 0}
                className="p-1"
              >
                ↑
              </Button>
              <Button
                onClick={() => moveEntry(index, 'down')}
                disabled={index === entries.length - 1}
                className="p-1"
              >
                ↓
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};