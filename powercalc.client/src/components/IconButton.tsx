interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  variant?: 'default' | 'delete' | 'primary';
}

export default function IconButton({ icon, onClick, title, className = '', variant = 'default' }: IconButtonProps) {
  const variantClass = variant === 'delete' ? 'delete-icon-button' : variant === 'primary' ? 'icon-button-primary' : '';

  return (
    <button
      className={`icon-button ${variantClass} ${className}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
}
