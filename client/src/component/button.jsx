import React from 'react';
import { Button } from 'antd';
import styles from '../css/CustomButton.module.css';

const CustomButton = ({ variant , onClick, children }) => {
  return (
    <Button onClick={onClick} className={styles[variant]}>
      {children}
    </Button>
  );
};

export default CustomButton;
