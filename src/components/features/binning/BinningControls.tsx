import React, { useMemo } from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { useClassification } from '../../../hooks/useClassification';
import { sldEditorActions } from '../../../actions/sldEditor';
import { calculateBreaks } from '../../../services/classification';
import { Card } from '../../common/ui/Card';
import { Button } from '../../common/ui/Button';

export const BinningControls: React.FC = () => {
  const { state, dispatch } = useSldEditorContext();
  const { applyClassification } = useClassification();
  const { binningControls, loading, initialEntries } = state;

  const handleNumBinsChange = (value: string) => {
    const numBins = Math.max(2, Math.min(20, parseInt(value, 10) || 2));
    dispatch(sldEditorActions.updateBinning({ numBins }));
  };

  const handleMethodChange = (value: BinningControls['method']) => {
    dispatch(sldEditorActions.updateBinning({ method: value }));
  };

  const handleRoundIncrementChange = (value: string) => {
    const roundIncrement = parseFloat(value) || 0;
    dispatch(sldEditorActions.updateBinning({ roundIncrement }));
  };

  const handleIncludeMissingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(sldEditorActions.updateBinning({ includeMissing: e.target.checked }));
  };

  // Calculate proposed breaks based on label values
  const proposedBreaks = useMemo(() => {
    try {
      const labelValues = initialEntries
        .map(e => parseFloat(e.label))
        .filter(v => !isNaN(v) && v !== -999);
      if (!labelValues.length) return [];
      return calculateBreaks(labelValues, {
        method: binningControls.method,
        numBins: binningControls.numBins,
        roundIncrement: binningControls.roundIncrement,
        includeMissing: binningControls.includeMissing,
      }).breaks;
    } catch {
      return [];
    }
  }, [initialEntries, binningControls]);

  return (
    <Card className="mb-4">
      <h2 className="text-lg font-semibold mb-4">Classification</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of Classes</label>
          <input
            type="number"
            min="2"
            max="20"
            value={binningControls.numBins}
            onChange={e => handleNumBinsChange(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Classification Method</label>
          <select
            value={binningControls.method}
            onChange={e => handleMethodChange(e.target.value as BinningControls['method'])}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="equalInterval">Equal Interval</option>
            <option value="quantile">Quantile</option>
            <option value="stdDev">Standard Deviation</option>
            <option value="jenks">Jenks Natural Breaks</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Round Increment</label>
          <input
            type="number"
            step="any"
            value={binningControls.roundIncrement}
            onChange={e => handleRoundIncrementChange(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
            placeholder="0 for no rounding"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={binningControls.includeMissing}
              onChange={handleIncludeMissingChange}
              disabled={loading}
            />
            <span>Include Missing Values</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Proposed Breaks Preview</label>
          <div className="text-sm text-gray-600">
            {proposedBreaks.length > 0 ? (
              proposedBreaks.map((breakVal, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{breakVal.toFixed(2)}</span>
                  {i < proposedBreaks.length - 1 && (
                    <div className="h-2 w-full bg-gray-200 rounded" style={{ flex: 1 }} />
                  )}
                </div>
              ))
            ) : (
              <span>No valid label data to preview</span>
            )}
          </div>
        </div>
        <Button onClick={applyClassification} disabled={loading || !proposedBreaks.length}>
          {loading ? 'Classifying...' : 'Apply Classifications'}
        </Button>
      </div>
    </Card>
  );
};