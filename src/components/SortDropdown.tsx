interface SortDropdownProps {
  sortOption: 'none' | 'peers' | 'seeders' | 'best';
  onSortChange: (option: 'none' | 'peers' | 'seeders' | 'best') => void;
}

const SortDropdown = ({ sortOption, onSortChange }: SortDropdownProps) => {
  return (
    <div className='flex items-center justify-center mt-4 gap-2'>
      <p>
        <span className='font-bold'>Ordenar por:</span>
      </p>
      <div className='dropdown'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-sm m-1'
        >
          {sortOption === 'none' && 'Sem ordenação'}
          {sortOption === 'peers' && 'Peers ↓'}
          {sortOption === 'seeders' && 'Seeders ↓'}
          {sortOption === 'best' && '⭐ Combinado'}
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
              Sem ordenação
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
              ⭐ Melhor opção (combinado)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SortDropdown;
