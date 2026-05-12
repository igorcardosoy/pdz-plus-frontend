interface CardProps {
  title?: string;
  description?: string;
  seeders?: number;
  peers?: number;
  providers?: string[];
  buttonText?: React.ReactNode;
  category?: string;
  categories?: string[];
  tracker?: string;
  link?: string;
  onButtonClick?: () => void;
  showDeleteButton?: boolean;
  onDeleteClick?: () => void;
  buttonSize?: 'sm' | 'md';
}

const Card = ({ title, description, providers, buttonText, link, category, categories, tracker, onButtonClick, showDeleteButton, onDeleteClick, buttonSize = 'md' }: CardProps) => {
  return (
    <div className={`card bg-base-200 shadow-sm h-64 md:w-96 w-full max-w-sm`}>
      <div className='card-body justify-between'>
        <div
          className='tooltip'
          data-tip={title}
        >
          <h2 className='card-title line-clamp-4 overflow-hidden text-ellipsis break-words'>{title}</h2>
        </div>

        {category && <div className='badge badge-soft badge-secondary'>{category}</div>}

        {categories && (
          <div className='flex flex-wrap gap-2'>
            {categories.map((cat, index) => (
              <span
                key={index}
                className='badge badge-soft badge-secondary'
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {description && <p>{description}</p>}
        <div className='card-actions items-end justify-between w-full mt-auto gap-3'>
          <div className='flex flex-col gap-1 min-w-0'>
            {(providers && providers.length > 0) ? (
              <div className='text-xs text-gray-500 w-fit shrink-0 break-words'>
                {providers.join(', ')}
              </div>
            ) : (
              tracker && <div className='text-xs text-gray-500 w-fit shrink-0'>{tracker}</div>
            )}
          </div>

          <div className='flex gap-2 justify-end'>
            {showDeleteButton && (
              <button
                className={`btn btn-error ${buttonSize === 'sm' ? 'btn-sm' : ''}`}
                onClick={onDeleteClick}
              >
                Deletar
              </button>
            )}
            {onButtonClick ? (
              <button
                className={`btn btn-primary ${buttonSize === 'sm' ? 'btn-sm' : ''}`}
                onClick={() => {
                  onButtonClick();
                  if (link) {
                    window.open(link, '_blank');
                  }
                }}
              >
                {buttonText}
              </button>
            ) : (
              <a
                href={link}
                target='_blank'
              >
                <button className={`btn btn-primary ${buttonSize === 'sm' ? 'btn-sm' : ''}`}>{buttonText}</button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
