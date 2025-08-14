export interface DropdownOption {
  label: string;
  description: string;
  action: () => void;
  value: string;
}

const Option = ({ label, description, action }: DropdownOption) => {
  return (
    <li>
      <a onClick={action}>
        <div className='flex flex-col'>
          <span>{label}</span>
          <span className='text-xs opacity-70'>{description}</span>
        </div>
      </a>
    </li>
  );
};

export default Option;
