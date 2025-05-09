import { Flex, Space } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import Button from '~/components/Button/Button';
import CopyButton from '~/components/Button/CopyButton';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { IUser } from '~/types/User';
import icons from '~/utils/icons';

interface IProps extends IModalProps {
  data: IUser;
}

const { CloseOutlined } = icons;

const JobContactModal = ({ data, className, onCancel, ...props }: IProps) => {
  const customClass = classNames('sm:!max-w-md', className);

  return (
    <Modal
      {...props}
      title="Thông tin liên hệ"
      className={customClass}
      footer={
        <Button
          title="Đóng"
          className="w-full"
          onClick={onCancel}
          iconBefore={<CloseOutlined />}
        />
      }
      onCancel={onCancel}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Flex className="text-xsm leading-6 max-sm:flex-col">
          <p className="flex-shrink-0 text-sub font-medium min-w-[140px]">
            Tên công ty
          </p>
          <p className="flex-1 font-semibold">{data?.companyName}</p>
        </Flex>
        <Flex className="text-xsm leading-6 max-sm:flex-col">
          <p className="flex-shrink-0 text-sub font-medium min-w-[140px]">
            Email
          </p>
          <Flex align="center" className="flex-1 font-semibold">
            {data?.email}
            <CopyButton value={data?.email} />
          </Flex>
        </Flex>
      </Space>
    </Modal>
  );
};

export default memo(JobContactModal);
