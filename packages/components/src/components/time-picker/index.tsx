import React, { useContext } from 'react';
import TimePicker from './TimePicker';
import { TimePickerProps } from './interface';
import { ConfigContext } from '../config-provider';
import { StopWatchOutlined, CloseCircleFilled } from '@gio-design/icons';

export default ({ prefixCls: customizePrefixCls, ...props }: TimePickerProps) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('time-picker', customizePrefixCls);

  return (
    <>
      <TimePicker
        prefixCls={prefixCls}
        inputIcon={<StopWatchOutlined color="#5C4E61" />}
        clearIcon={<CloseCircleFilled />}
        {...props}
      />
    </>
  );
};
