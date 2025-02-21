import { useCallback } from 'react';
import { useSldEditorContext } from '../context/SldEditorContext';
import { sldEditorActions } from '../actions/sldEditor';
import { GRADIENT_PRESETS } from '../constants/gradientPresets';
import { getMultiStopColor } from '../utils/colorUtils';
import { generateSld } from '../services/sld/generator';

export function useGradient() {
  const { state, dispatch } = useSldEditorContext();

  const applyGradient = useCallback(() => {
    const targetEntries = state.entries.length ? state.entries : state.initialEntries;
    if (!targetEntries.length) return;

    const presetColors = GRADIENT_PRESETS[state.editableLegend.gradientPreset] || [];
    if (!presetColors.length) return;

    const newEntries = targetEntries.map((entry, i) => {
      const t = targetEntries.length > 1 ? i / (targetEntries.length - 1) : 0;
      return { ...entry, color: getMultiStopColor(presetColors, t) };
    });

    const updatedSld = generateSld(newEntries, state.sldText);
    dispatch(sldEditorActions.setEntries(newEntries));
    dispatch(sldEditorActions.setOutputSld(updatedSld));
  }, [state.entries, state.initialEntries, state.editableLegend.gradientPreset, state.sldText, dispatch]);

  return { applyGradient };
}