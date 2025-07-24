interface FilterProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Filter = ({ className, ...props }: FilterProps) => {
  return <input type='checkbox' className={`toggle ${className}`} {...props} />;
};

export default Filter;
