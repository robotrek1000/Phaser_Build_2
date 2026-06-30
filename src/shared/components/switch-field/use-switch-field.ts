import { useState } from 'react';

import type { SwitchFieldProps } from './switch-field.types';

export const useSwitchField = ({
  defaultValue = false,
  onChange,
}: SwitchFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  const onClick = () => {
    setValue((value) => {
      const newValue = !value;

      onChange(newValue);

      return newValue;
    });
  };

  return { value, onClick };
};
