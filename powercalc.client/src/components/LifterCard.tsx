import { Lifter } from '../types';
import IconButton from './IconButton';
import { EditIcon, DeleteIcon } from './icons';

interface LifterCardProps {
  lifter: Lifter;
  onEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function LifterCard({ lifter, onEdit, onDelete }: LifterCardProps) {
  return (
    <div className="lifter-card">
      <h3>{lifter.name}</h3>
      <div className="lifter-card-actions">
        <IconButton
          icon={<EditIcon />}
          title="Edit Lifter"
          onClick={() => onEdit(lifter.name)}
        />
        <IconButton
          icon={<DeleteIcon />}
          title="Delete Lifter"
          onClick={() => onDelete(lifter.name)}
          variant="delete"
        />
      </div>
      <div className="lifter-stats">
        <div className="stat">
          <span className="stat-label">Squat</span>
          <span className="stat-value">{lifter.oneRepMaxes.squat || 0} kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">Bench</span>
          <span className="stat-value">{lifter.oneRepMaxes.bench || 0} kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">Deadlift</span>
          <span className="stat-value">{lifter.oneRepMaxes.deadlift || 0} kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">OHP</span>
          <span className="stat-value">{lifter.oneRepMaxes.ohp || 0} kg</span>
        </div>
      </div>
    </div>
  );
}
