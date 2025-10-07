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
      <div className="lifter-card-actions">
        <button className="icon-button" title="Edit Lifter" onClick={() => onEdit(lifter.name)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </button>
        <button className="icon-button delete-icon-button" title="Delete Lifter" onClick={() => onDelete(lifter.name)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
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
