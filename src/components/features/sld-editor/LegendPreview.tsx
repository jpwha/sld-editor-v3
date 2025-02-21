// src/components/features/sld-editor/LegendPreview.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Card } from '../../common/ui/Card';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ChromePicker } from 'react-color';
import { GripHorizontal } from 'lucide-react';
import { ColorMapEntry } from '../../../types/sld.types';

// Enhanced Legend Preview Item
const LegendPreviewItem = ({ 
  entry, 
  index, 
  provided, 
  editingIndex, 
  setEditingIndex, 
  onLabelChange, 
  onColorChange 
}: {
  entry: ColorMapEntry;
  index: number;
  provided: any;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  onLabelChange: (index: number, newLabel: string) => void;
  onColorChange: (index: number, newColor: string) => void;
}) => {
  const [editValue, setEditValue] = useState(entry.label);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditValue(entry.label);
  };

  const handleEditComplete = () => {
    onLabelChange(index, editValue);
    setEditingIndex(null);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200 hover:bg-gray-50 draggable-item"
    >
      <div
        {...provided.dragHandleProps}
        className="cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <GripHorizontal size={16} />
      </div>
      
      <div className="relative">
        <div
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: entry.color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker && (
          <div 
            ref={colorPickerRef}
            className="absolute top-full left-0 mt-1 z-50"
          >
            <ChromePicker
              color={entry.color}
              onChange={(color) => onColorChange(index, color.hex)}
            />
          </div>
        )}
      </div>
      
      {editingIndex === index ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditComplete}
          onKeyPress={(e) => e.key === 'Enter' && handleEditComplete()}
          className="flex-1 p-1 border rounded text-sm"
          autoFocus
        />
      ) : (
        <div 
          onClick={handleEditStart}
          className="flex-1 text-sm cursor-text hover:bg-gray-100 p-1 rounded"
        >
          {entry.label}
        </div>
      )}
    </div>
  );
};

// Main Legend Preview Component
export const LegendPreview: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { entries } = state;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const uniqueEntries = Array.from(new Map(entries.map(entry => [entry.label, entry])).values());

  const handleLabelChange = (index: number, newLabel: string) => {
    const oldLabel = uniqueEntries[index].label;
    const newEntries = entries.map(entry =>
      entry.label === oldLabel ? { ...entry, label: newLabel, baseLabel: newLabel } : entry
    );
    dispatch(sldEditorActions.setEntries(newEntries));
  };

  const handleColorChange = (index: number, newColor: string) => {
    const targetLabel = uniqueEntries[index].label;
    const newEntries = entries.map(entry =>
      entry.label === targetLabel ? { ...entry, color: newColor } : entry
    );
    dispatch(sldEditorActions.setEntries(newEntries));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedUniqueEntries = Array.from(uniqueEntries);
    const [movedItem] = reorderedUniqueEntries.splice(result.source.index, 1);
    reorderedUniqueEntries.splice(result.destination.index, 0, movedItem);
    
    const newEntries: ColorMapEntry[] = [];
    reorderedUniqueEntries.forEach(uniqueEntry => {
      const matchingEntries = entries.filter(e => e.label === uniqueEntry.label);
      newEntries.push(...matchingEntries);
    });
    
    dispatch(sldEditorActions.setEntries(newEntries));
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <div className="p-3 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Legend Preview</h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {uniqueEntries.length} unique classes
        </p>
      </div>
      <div className="p-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="legend-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {uniqueEntries.map((entry, index) => (
                  <Draggable
                    key={entry.label}
                    draggableId={entry.label}
                    index={index}
                  >
                    {(provided) => (
                      <LegendPreviewItem
                        entry={entry}
                        index={index}
                        provided={provided}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        onLabelChange={handleLabelChange}
                        onColorChange={handleColorChange}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Card>
  );
};