interface MessageBoxProps {
  type: 'info' | 'error' | 'confirm';
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function MessageBox({ type, message, onConfirm, onCancel }: MessageBoxProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleOverlayClick = () => {
    if (type === 'confirm' && onCancel) {
      onCancel();
    } else {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content message-box" onClick={(e) => e.stopPropagation()}>
        <div className="message-box-body">
          <p>{message}</p>
        </div>
        <div className="message-box-footer">
          {type === 'confirm' ? (
            <>
              <button className="message-box-cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="message-box-confirm-button" onClick={handleConfirm}>
                Confirm
              </button>
            </>
          ) : (
            <button className="message-box-ok-button" onClick={handleConfirm}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
