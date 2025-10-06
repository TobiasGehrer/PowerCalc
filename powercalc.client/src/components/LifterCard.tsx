interface Lifter {
  name: string;
  oneRepMaxes: {
    squat: number;
    bench: number;
    deadlift: number;
    ohp: number;
    [key: string]: number;
  };
}

interface LifterCardProps {
  lifter: Lifter;
  onEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function LifterCard({ lifter, onEdit, onDelete }: LifterCardProps) {
  return (
    <div className="lifter-card">
      <h3>{lifter.name}</h3>
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
      <div className="actions">
        <button className="edit-button" onClick={() => onEdit(lifter.name)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(lifter.name)}>
          Delete
        </button>
      </div>
    </div>
  );
}
