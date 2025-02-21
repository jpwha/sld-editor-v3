import React, { useState } from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { ChromePicker } from 'react-color';

export const EditableLegendEntry: React.FC<{ entry: ColorMapEntry }> = ({ entry }) => {
  const { state, dispatch } = useSldEditorContext();
  const { colorPickerType } = state.editableLegend;
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color: { hex: string }) => {
    const newEntries = state.entries.map(e =>
      e.label === entry.label ? { ...e, color: color.hex } : e
    );
    dispatch(sldEditorActions.setEntries(newEntries));
    setShowPicker(false);
  };

  // Simplified to ChromePicker for brevity; expand as needed
  return (
    <div className="relative mb-2">
      <div className="flex items-center gap-2">
        <div
          role="button"
          aria-label={`Change color for ${entry.label}`}
          style={{ backgroundColor: entry.color, cursor: 'pointer' }}
          className="w-6 h-6 border border-gray-300"
          onClick={() => setShowPicker(prev => !prev)}
        />
        <span className="text-sm">{entry.label}</span>
      </div>
      {showPicker && (
        <div className="absolute z-10 mt-2">
          <ChromePicker
            color={entry.color}
            onChangeComplete={color => handleColorChange(color)}
          />
        </div>
      )}
    </div>
  );
};