import '@/app/globals.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button = (props: ButtonProps) => {
  return (
    <>
      <button
        {...props}
        className={`btn ${props.className}`}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
