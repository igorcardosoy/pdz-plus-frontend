import React from 'react';

interface FieldsetProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  type?: 'normal' | 'join';
  legend?: React.ReactNode;
  children?: React.ReactNode;
}

const Fieldset = ({ ...props }: FieldsetProps) => {
  return (
    <>
      <fieldset className={`fieldset bg-base-200 rounded-box w-xs p-4 ${props.className}`}>
        <legend className='fieldset-legend'>{props.legend}</legend>
        <div className={props.type ? 'join' : 'flex'}>{props.children}</div>
      </fieldset>
    </>
  );
};

export default Fieldset;
