import { X } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = ({ icon, clearable, onClear, ...props }: InputProps) => {
  return (
    <>
      {(icon || clearable) ? (
        <label
          className={`input flex items-center gap-2 ${props.className || ''}`}
        >
          {icon}
          <input
            {...props}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            className='grow w-full'
          />
          {clearable && props.value ? (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClear}
            >
              <X size={16} />
            </button>
          ) : null}
        </label>
      ) : (
        <input
          {...props}
          type={props.type}
          className={`input ${props.className || ''}`}
          placeholder={props.placeholder}
        />
      )}
    </>
  );
};

export default Input;
