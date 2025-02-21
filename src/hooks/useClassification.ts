import { useCallback } from 'react';
import { useSldEditorContext } from '../context/SldEditorContext';
import { calculateBreaks, ClassificationError } from '../services/classification';
import { sldEditorActions } from '../actions/sldEditor';
import { generateSld } from '../services/sld/generator';

export function useClassification() {
  const { state, dispatch } = useSldEditorContext();

  const applyClassification = useCallback(() => {
    dispatch(sldEditorActions.setLoading(true));
    try {
      const labelValues = state.initialEntries
        .map(e => parseFloat(e.label))
        .filter(v => !isNaN(v) && v !== -999);

      if (!labelValues.length) {
        throw new ClassificationError('No valid label values found in original SLD');
      }

      const result = calculateBreaks(labelValues, {
        method: state.binningControls.method,
        numBins: state.binningControls.numBins,
        roundIncrement: state.binningControls.roundIncrement,
        includeMissing: state.binningControls.includeMissing,
      });

      const breaks = result.breaks;
      const numBins = state.binningControls.numBins;
      const classes = [];

      for (let i = 0; i < numBins; i++) {
        const start = breaks[i];
        const end = breaks[i + 1];
        const label = state.editableLegend.displayAsPercentage
          ? `${(i * 100 / numBins).toFixed(state.editableLegend.decimalPlaces)}% - ${((i + 1) * 100 / numBins).toFixed(state.editableLegend.decimalPlaces)}%`
          : state.editableLegend.reverseRangeDisplay
            ? `${end.toFixed(state.editableLegend.decimalPlaces)} - ${start.toFixed(state.editableLegend.decimalPlaces)}`
            : `${start.toFixed(state.editableLegend.decimalPlaces)} - ${end.toFixed(state.editableLegend.decimalPlaces)}`;

        // Find all values that fall within this class
        // For the last class, include the upper bound
        const matchingOriginals = state.initialEntries
          .filter(e => {
            const val = parseFloat(e.label);
            if (isNaN(val) || val === -999) return false;
            
            return i === numBins - 1 
              ? val >= start && val <= end  // Include upper bound for last class
              : val >= start && val < end;  // Exclude upper bound for other classes
          });

        // Always create a class entry, even if no matching originals
        classes.push({
          color: matchingOriginals[0]?.color || '#000000',
          quantity: matchingOriginals[0]?.quantity || start.toString(),
          label: label,
          opacity: matchingOriginals[0]?.opacity || '1.0',
          baseLabel: label,
        });

        // Add any additional matching entries with the same label
        for (let j = 1; j < matchingOriginals.length; j++) {
          classes.push({
            ...matchingOriginals[j],
            label: label,
            baseLabel: label,
          });
        }
      }

      // Add missing values class if needed
      if (state.binningControls.includeMissing) {
        const missingEntries = state.initialEntries.filter(e =>
          e.label === 'nan' || e.label === 'na' || e.label === 'null' || parseFloat(e.label) === -999
        );
        if (missingEntries.length > 0) {
          classes.push({
            color: '#000000',
            quantity: '-999',
            label: 'Missing (nan/na/null/-999)',
            opacity: '1.0',
            baseLabel: 'Missing (nan/na/null/-999)',
          });
        }
      }

      const updatedSld = generateSld(classes, state.sldText);
      dispatch(sldEditorActions.setEntries(classes));
      dispatch(sldEditorActions.setOutputSld(updatedSld));
    } catch (error) {
      dispatch(sldEditorActions.setError(
        error instanceof ClassificationError ? error.message : 'Unexpected error during classification'
      ));
    } finally {
      dispatch(sldEditorActions.setLoading(false));
    }
  }, [state.initialEntries, state.binningControls, state.editableLegend, state.sldText, dispatch]);

  return { applyClassification };
}