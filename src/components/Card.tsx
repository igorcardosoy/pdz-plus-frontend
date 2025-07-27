interface CardProps {
  title?: string;
  description?: string;
  seeders?: number;
  peers?: number;
  buttonText?: React.ReactNode;
  category?: string;
  categories?: string[];
  tracker?: string;
  link?: string;
}

const Card = ({ title, description, seeders, peers, buttonText, link, category, categories, tracker }: CardProps) => {
  let seedLevels = [
    { label: 'Muito Baixo', value: 0, className: 'badge badge-soft badge-info' },
    { label: 'Baixo', value: 1, className: 'badge badge-soft badge-info' },
    { label: 'Médio', value: 2, className: 'badge badge-soft badge-info' },
    { label: 'Alto', value: 3, className: 'badge badge-soft badge-info' },
    { label: 'Muito Alto', value: 4, className: 'badge badge-soft badge-info' },
  ];

  let seedLevel = 0;
  let peersLevel = 0;
  if (seeders && seeders > 0) {
    seedLevel = Math.min(Math.floor(seeders / 20), seedLevels.length - 1);
  }

  if (peers && peers > 0) {
    peersLevel = Math.min(Math.floor(peers / 20), seedLevels.length - 1);
  }

  return (
    <div className={`card bg-base-200 shadow-sm h-56 w-92`}>
      <div className='card-body justify-between'>
        <h2 className='card-title line-clamp-2 overflow-hidden text-ellipsis break-words'>{title}</h2>
        <div className='card-actions'>
          {<div className={seedLevels[seedLevel].className}>Seeders: {seeders ? seeders : 0}</div>}
          {<div className={seedLevels[peersLevel].className}>Peers: {peers ? peers : 0}</div>}
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
        <div className='card-actions items-baseline justify-between'>
          {tracker && <div className='text-xs text-gray-500 mt-2 w-fit'>{tracker}</div>}

          <a
            href={link}
            target='_blank'
          >
            <button className='btn btn-primary btn-soft'>{buttonText}</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
