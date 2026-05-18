'use client';

type Props = {
  onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
  return (
    <button
      className="btn btn-primary w-full"
      onClick={() => {
        onSignIn();
      }}
    >
      Entrar com Logto
    </button>
  );
};

export default SignIn;