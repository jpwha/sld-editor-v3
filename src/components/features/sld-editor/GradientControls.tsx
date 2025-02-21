// src/components/features/sld-editor/GradientControls.tsx
import React, { useState } from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Card } from '../../common/ui/Card';
import { GRADIENT_PRESETS } from '../../../constants/gradientPresets';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChromePicker } from 'react-color';
import { DragHandle, X, Plus } from 'lucide-react';
import { Button } from '../../common/ui/Button';
import { generateSld } from '../../../services/sld/generator';
import { getMultiStopColor } from '../../../utils/colorUtils';

// Enhanced Gradient Select with previews
const GradientSelect = ({ value, onChange }: { value: string; onChange: (e: { target: { value: string } }) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div 
        className="w-full p-2 border rounded cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div 
          className="w-32 h-6 rounded"
          style={{ background: `linear-gradient(to right, ${GRADIENT_PRESETS[value].join(',')})` }} 
        />
        <span className="text-sm">{value}</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow-lg z-50 max-h-64 overflow-y-auto">
          {Object.entries(GRADIENT_PRESETS).map(([name, colors]) => (
            <div 
              key={name}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange({ target: { value: name } });
                setIsOpen(false);
              }}
            >
              <div 
                className="w-32 h-6 rounded"
                style={{ background: `linear-gradient(to right, ${colors.join(',')})` }} 
              />
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Gradient Controls
export const GradientControls: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { editableLegend, entries, sldText } = state;
  const [customColors, setCustomColors] = useState(['#ff0000', '#00ff00', '#0000ff']);

  const handlePresetChange = (e: { target: { value: string } }) => {
    dispatch(sldEditorActions.updateLegend({ gradientPreset: e.target.value }));
  };

  const handleAddColor = () => {
    setCustomColors([...customColors, '#ffffff']);
  };

  const handleRemoveColor = (index: number) => {
    if (customColors.length > 2) {
      setCustomColors(customColors.filter((_, i) => i !== index));
    }
  };

  const handleCustomColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
  };

  const applyGradient = (colors: string[]) => {
    if (!entries.length) return;

    const uniqueEntries = Array.from(new Map(entries.map(entry => [entry.label, entry])).values());
    const uniqueWithNewColors = uniqueEntries.map((entry, i) => {
      const t = uniqueEntries.length > 1 ? i / (uniqueEntries.length - 1) : 0;
      return { ...entry, color: getMultiStopColor(colors, t) };
    });

    const newEntries = entries.map(entry => ({
      ...entry,
      color: uniqueWithNewColors.find(u => u.label === entry.label)?.color || entry.color
    }));

    const updatedSld = generateSld(newEntries, sldText);
    dispatch(sldEditorActions.setEntries(newEntries));
    dispatch(sldEditorActions.setOutputSld(updatedSld));
  };

  return (
    <Card className="mb-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Gradient Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preset Gradient</label>
            <GradientSelect value={editableLegend.gradientPreset} onChange={handlePresetChange} />
            <Button 
              className="w-full mt-2"
              onClick={() => applyGradient(GRADIENT_PRESETS[editableLegend.gradientPreset])}
            >
              Apply Preset Gradient
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Gradient</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {customColors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleCustomColorChange(idx, e.target.value)}
                    className="w-8 h-8 cursor-pointer rounded"
                  />
                  {customColors.length > 2 && (
                    <button
                      onClick={() => handleRemoveColor(idx)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="icon" onClick={handleAddColor}>
                <Plus size={16} />
              </Button>
            </div>
            <div 
              className="h-8 w-full rounded mb-2"
              style={{ background: `linear-gradient(to right, ${customColors.join(',')})` }}
            />
            <Button 
              className="w-full"
              onClick={() => applyGradient(customColors)}
            >
              Apply Custom Gradient
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};