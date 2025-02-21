import React, { useState } from 'react';
import { useSldEditorContext } from '../../../context/SldEditorContext';
import { sldEditorActions } from '../../../actions/sldEditor';
import { Card } from '../../common/ui/Card';
import { Button } from '../../common/ui/Button';

interface SldCodeEditorProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onParse?: () => void;
  onRefresh?: () => void;
  onSave?: () => void;
}

export const SldCodeEditor: React.FC<SldCodeEditorProps> = ({
  title,
  value,
  onChange,
  readOnly = false,
  onParse,
  onRefresh,
  onSave,
}) => {
  const { state, dispatch } = useSldEditorContext();
  const { loading } = state;
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopy = async (text: string, type: 'input' | 'output') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${type === 'input' ? 'Input' : 'Output'} copied to clipboard`);
      setTimeout(() => setCopyMessage(''), 2000);
    } catch (err) {
      dispatch(sldEditorActions.setError('Failed to copy'));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (onChange) onChange(text);
    } catch (err) {
      dispatch(sldEditorActions.setError('Failed to paste'));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex gap-2">
            {!readOnly && (
              <>
                <Button onClick={handlePaste} disabled={loading}>Paste</Button>
                <Button onClick={() => handleCopy(value, title.toLowerCase().includes('input') ? 'input' : 'output')} disabled={loading}>Copy</Button>
              </>
            )}
            {onParse && <Button onClick={onParse} disabled={!value || loading}>Parse</Button>}
            {onRefresh && <Button onClick={onRefresh} disabled={!value || loading}>Refresh</Button>}
            {onSave && <Button onClick={onSave} disabled={!value || loading}>Save</Button>}
            {readOnly && <Button onClick={() => handleCopy(value, 'output')} disabled={loading}>Copy</Button>}
          </div>
        </div>
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="w-full h-64 p-2 border rounded font-mono text-sm"
          placeholder={`Paste or load ${title.toLowerCase()} SLD XML here...`}
          disabled={loading || readOnly}
          readOnly={readOnly}
        />
      </Card>
      {copyMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg">
          {copyMessage}
        </div>
      )}
    </div>
  );
};