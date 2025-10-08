import { useState } from 'react';
import { Program, AppState } from '../types';
import IconButton from './IconButton';
import { ViewIcon, EditIcon, PlusIcon } from './icons';
import ProgramView from '../pages/ProgramView';
import ProgramEditor from '../pages/ProgramEditor';

interface ProgramSelectorProps {
  programs: Program[];
  state: AppState;
  onStateChange: (field: string, value: any) => void;
  onProgramsUpdated: () => void;
}

export default function ProgramSelector({ programs, state, onStateChange, onProgramsUpdated }: ProgramSelectorProps) {
  const currentProgram = programs.find((p) => p.name === state.currentProgram);
  const [showProgramView, setShowProgramView] = useState(false);
  const [showProgramEditor, setShowProgramEditor] = useState(false);
  const [editingProgramName, setEditingProgramName] = useState<string | undefined>(undefined);

  const handleAddProgram = () => {
    setEditingProgramName(undefined);
    setShowProgramEditor(true);
  };

  const handleEditProgram = () => {
    setEditingProgramName(state.currentProgram);
    setShowProgramEditor(true);
  };

  const handleEditorClose = () => {
    setShowProgramEditor(false);
    setEditingProgramName(undefined);
  };

  const handleEditorSave = () => {
    onProgramsUpdated();
  };

  return (
    <section className="program-selection">
      <h2>Current Program</h2>
      <div className="program-action-buttons">
        <IconButton
          icon={<ViewIcon />}
          title="View Program"
          onClick={() => setShowProgramView(true)}
        />
        <IconButton
          icon={<EditIcon />}
          title="Edit Program"
          onClick={handleEditProgram}
        />
        <IconButton
          icon={<PlusIcon />}
          title="Add Program"
          variant="primary"
          onClick={handleAddProgram}
        />
      </div>
      <div className="program-controls">
        <div className="form-field">
          <label>Program:</label>
          <select
            value={state.currentProgram}
            onChange={(e) => onStateChange('currentProgram', e.target.value)}
          >
            {programs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="week-day-controls">
          <div className="form-field">
            <label>Week:</label>
            <select
              value={state.currentWeek}
              onChange={(e) => onStateChange('currentWeek', parseInt(e.target.value))}
            >
              {currentProgram &&
                Array.from({ length: currentProgram.weeks }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Week {i + 1}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-field">
            <label>Day:</label>
            <select
              value={state.currentDay}
              onChange={(e) => onStateChange('currentDay', parseInt(e.target.value))}
            >
              {currentProgram &&
                Array.from({ length: currentProgram.days }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {showProgramView && (
        <ProgramView
          programName={state.currentProgram}
          onClose={() => setShowProgramView(false)}
        />
      )}

      {showProgramEditor && (
        <ProgramEditor
          programName={editingProgramName}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}
    </section>
  );
}
