interface SortDropdownProps {
  sortOption: 'none' | 'peers' | 'seeders' | 'best';
  text: string;
  onSortChange: (option: 'none' | 'peers' | 'seeders' | 'best') => void;
}

const SortDropdown = ({ sortOption, text, onSortChange }: SortDropdownProps) => {
  return (
    <div className='flex items-center justify-center mt-4 gap-2'>
      <p className='text-center'>
        <span className='font-bold'>{text}</span>
      </p>
      <div className='dropdown dropdown-end'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-sm m-1'
        >
          {sortOption === 'none' && 'Por nome'}
          {sortOption === 'peers' && 'Peers ↓'}
          {sortOption === 'seeders' && 'Seeders ↓'}
          {sortOption === 'best' && '⭐ Combinado (com base em seeders e peers)'}
        </div>
        <ul
          tabIndex={0}
          className='dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow'
        >
          <li>
            <a
              onClick={() => onSortChange('none')}
              className={sortOption === 'none' ? 'active' : ''}
            >
              Por nome (Proximidade com o título)
            </a>
          </li>
          <li>
            <a
              onClick={() => onSortChange('peers')}
              className={sortOption === 'peers' ? 'active' : ''}
            >
              Peers (maior para menor)
            </a>
          </li>
          <li>
            <a
              onClick={() => onSortChange('seeders')}
              className={sortOption === 'seeders' ? 'active' : ''}
            >
              Seeders (maior para menor)
            </a>
          </li>
          <li>
            <a
              onClick={() => onSortChange('best')}
              className={sortOption === 'best' ? 'active' : ''}
            >
              ⭐ Melhor opção (combinado com base em seeders e peers)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SortDropdown;
