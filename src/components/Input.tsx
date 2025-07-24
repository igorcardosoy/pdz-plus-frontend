interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
}

const Input = ({ icon, ...props }: InputProps) => {
  return (
    <>
      {(icon && (
        <label
          className='input'
          {...(props as React.LabelHTMLAttributes<HTMLLabelElement>)}
        >
          {icon}
          <input
            type={props.type}
            className='grow'
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
        </label>
      )) || (
        <input
          {...props}
          type={props.type}
          className={`input ${props.className}`}
          placeholder={props.placeholder}
        />
      )}
    </>
  );
};

export default Input;
