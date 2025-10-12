import { useState } from 'react';
import { Lifter } from '../../types';
import LifterCard from '../LifterCard/LifterCard';
import IconButton from '../IconButton/IconButton';
import MessageBox from '../MessageBox/MessageBox';
import { PlusIcon } from '../Icons/Icons';
import './LiftersSection.css';

interface LiftersSectionProps {
  lifters: Lifter[];
  onAddLifter: () => void;
  onDeleteLifter: (name: string) => void;
}

export default function LiftersSection({ lifters, onAddLifter, onDeleteLifter }: LiftersSectionProps) {
  const [messageBox, setMessageBox] = useState<{
    type: 'info' | 'error' | 'confirm';
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const handleDeleteLifter = (name: string) => {
    setMessageBox({
      type: 'confirm',
      message: `Delete ${name}?`,
      onConfirm: async () => {
        setMessageBox(null);
        onDeleteLifter(name);
      },
      onCancel: () => setMessageBox(null),
    });
  };

  return (
    <>
      <section className="lifters-section">
        <h2>Lifters</h2>
        <IconButton
          icon={<PlusIcon />}
          title="Add Lifter"
          variant="primary"
          className="lifters-add-button"
          onClick={onAddLifter}
        />
        <div className="lifters-grid">
          {lifters.map((lifter) => (
            <LifterCard
              key={lifter.name}
              lifter={lifter}
              onEdit={() => {}}
              onDelete={handleDeleteLifter}
            />
          ))}
        </div>
      </section>

      {messageBox && (
        <MessageBox
          type={messageBox.type}
          message={messageBox.message}
          onConfirm={messageBox.onConfirm}
          onCancel={messageBox.onCancel}
        />
      )}
    </>
  );
}
