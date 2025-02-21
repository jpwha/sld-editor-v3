import React, { useCallback } from 'react';
import { useSldEditorContext } from '../../context/SldEditorContext';
import { sldEditorActions } from '../../actions/sldEditor';
import { SldCodeEditor } from '../features/sld-editor/SldCodeEditor';
import { BinningControls } from '../features/binning/BinningControls';
import { DataTypeSelector } from '../features/sld-editor/DataTypeSelector';
import { GradientControls } from '../features/sld-editor/GradientControls';
import { LegendEditor } from '../features/sld-editor/LegendEditor';
import { LegendPreview } from '../features/sld-editor/LegendPreview';
import { OrderingPanel } from '../features/sld-editor/OrderingPanel';
import { Card } from '../common/ui/Card';
import { parseSld } from '../../services/sld/parser';
import { generateSld } from '../../services/sld/generator';

export const SldEditorLayout: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { dataType, error, loading, sldText, outputSld, entries } = state;

  const handleParse = useCallback(() => {
    try {
      const entries = parseSld(sldText);
      dispatch(sldEditorActions.setEntries(entries));
    } catch (error) {
      dispatch(sldEditorActions.setError((error as Error).message));
    }
  }, [sldText, dispatch]);

  const handleRefresh = useCallback(() => {
    if (!entries.length || !sldText) return;
    const updatedSld = generateSld(entries, sldText);
    dispatch(sldEditorActions.setOutputSld(updatedSld));
  }, [entries, sldText, dispatch]);

  const handleSave = useCallback(() => {
    console.log('Saving SLD:', outputSld);
  }, [outputSld]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">SLD Editor</h1>
        {error && (
          <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>
        )}
        {loading && (
          <div className="text-blue-600 bg-blue-50 p-2 rounded">Classifying data...</div>
        )}
      </header>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <SldCodeEditor
              title="Input SLD"
              value={sldText}
              onChange={v => dispatch(sldEditorActions.setSldText(v))}
              onParse={handleParse}
            />
          </div>
          <div>
            <SldCodeEditor
              title="Output SLD"
              value={outputSld}
              readOnly
              onRefresh={handleRefresh}
              onSave={handleSave}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1">
            <DataTypeSelector />
            {dataType.id !== 'categorical' && <BinningControls />}
          </div>
          <div className="col-span-1">
            <Card className="p-4 h-full">
              <GradientControls />
            </Card>
          </div>
          <div className="col-span-1">
            <Card className="p-4 h-full">
              <LegendEditor />
            </Card>
          </div>
          <div className="col-span-1">
            <LegendPreview />
          </div>
        </div>
        <div className="mt-6">
          <OrderingPanel className="w-full" />
        </div>
      </div>
    </div>
  );
};