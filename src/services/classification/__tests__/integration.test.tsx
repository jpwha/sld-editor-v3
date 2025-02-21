 
import { renderHook, act } from '@testing-library/react-hooks';
import { useClassification } from '../../hooks/useClassification';
import { SldEditorProvider, SldEditorState } from '../../context/SldEditorContext';

interface TestProviderProps {
  children: React.ReactNode;
  initialState?: Partial<SldEditorState>;
}

const TestProvider: React.FC<TestProviderProps> = ({ children, initialState = {} }) => (
  <SldEditorProvider initialState={{ ...initialState }}>{children}</SldEditorProvider>
);

const defaultState: SldEditorState = {
  entries: [],
  binningControls: { numBins: 5, method: 'equalInterval', roundIncrement: 0, includeMissing: false },
  dataType: { id: 'roads', label: 'Roads', units: [{ id: 'km', label: 'Kilometers (km)' }], defaultBins: 5, defaultColors: ['#ff0000', '#00ff00'] },
  selectedUnit: { id: 'km', label: 'Kilometers (km)' },
  sldText: '',
  outputSld: '',
  editableLegend: { colorPickerType: 'chrome', gradientPreset: 'Spectral', reverseRangeDisplay: false, decimalPlaces: 2, displayAsPercentage: false },
  loading: false,
  error: null,
};

describe('Classification Integration', () => {
  const mockEntries = [
    { quantity: '1', color: '#000000', label: '1', opacity: '1.0' },
    { quantity: '2', color: '#000000', label: '2', opacity: '1.0' },
    { quantity: 'NaN', color: '#000000', label: 'NaN', opacity: '1.0' },
    { quantity: '-999', color: '#000000', label: '-999', opacity: '1.0' },
  ];

  it('processes valid and invalid values correctly', () => {
    const { result } = renderHook(() => useClassification(), {
      wrapper: ({ children }) => (
        <TestProvider initialState={{ ...defaultState, entries: mockEntries, binningControls: { ...defaultState.binningControls, numBins: 2, includeMissing: true } }}>
          {children}
        </TestProvider>
      ),
    });

    act(() => result.current.applyClassification());

    const entries = result.current.state.entries;
    expect(entries).toHaveLength(3);
    expect(entries[2].label).toContain('Missing');
  });

  it('handles all classification methods with loading states', () => {
    const methods: ClassificationMethod[] = ['equalInterval', 'quantile', 'stdDev', 'jenks'];
    methods.forEach(method => {
      const { result } = renderHook(() => useClassification(), {
        wrapper: ({ children }) => (
          <TestProvider initialState={{ ...defaultState, entries: mockEntries, binningControls: { ...defaultState.binningControls, method, numBins: 3 } }}>
            {children}
          </TestProvider>
        ),
      });

      act(() => result.current.applyClassification());
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.entries.length).toBe(3);
    });
  });
});