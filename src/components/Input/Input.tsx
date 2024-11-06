import { ConfigProvider, Input as InputAntd, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Input = ({ className, ...props }: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: '#fafafa',
          },
        },
      }}
    >
      <InputAntd
        size="middle"
        allowClear={allowClear}
        className={customClass}
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(Input);
