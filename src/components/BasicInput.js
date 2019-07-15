import React from 'react';
import { Input } from 'native-base';

const BasicInput = props => (
  <Input
    autoCapitalize="none"
    autoCorrect={false}
    {...props}
  />
);

export default BasicInput;
