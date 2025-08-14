import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import Option, { DropdownOption } from './Option';

interface DropdownProps {
  title: string;
  selectedValue: DropdownOption['value'];
  children: ReactNode;
}

const Dropdown = ({ children, title, selectedValue }: DropdownProps) => {
  const getOptionChildren = () => {
    return Children.toArray(children).filter(
      (child): child is ReactElement => isValidElement(child) && child.type === Option
    ) as ReactElement[];
  };

  const optionChildren = getOptionChildren();

  if (process.env.NODE_ENV === 'development' && optionChildren.length !== Children.count(children)) {
    console.warn('Dropdown: Apenas componentes Option são permitidos como children');
  }

  return (
    <div className='flex items-center justify-center mt-4 gap-2'>
      <p className='text-center'>
        <span className='font-semibold'>{title}</span>
      </p>
      <div className='dropdown dropdown-end'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-sm m-1'
        >
          {(() => {
            const selectedChild = optionChildren.find(child => (child.props as any).value === selectedValue);
            return selectedChild ? (selectedChild.props as any).label : 'Selecione';
          })()}
        </div>
        <ul
          tabIndex={0}
          className='dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow'
        >
          {optionChildren}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
