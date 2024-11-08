import { Avatar, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserApi from '~/apis/user';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { UserListResponse } from '~/types/User';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { UserOutlined, EyeOutlined, EditOutlined } = icons;

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { data: allUser } = useFetch<UserListResponse>(
    ['allUsers'],
    UserApi.getAllUser
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'font-bold',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'avatar',
      render: (avatar: string) => (
        <Avatar
          className="shadow-lg"
          icon={<UserOutlined />}
          src={avatar}
          size="large"
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="orange">Hoạt động</Tag>
        ) : (
          <Tag color="red">Bị chặn</Tag>
        ),
    },
    {
      title: 'Quyền',
      dataIndex: ['role', 'title'],
      className: 'capitalize',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: any) => {
        console.log(record);
        return (
          <Space>
            <Popconfirm title="Bạn chắc chắn rằng muốn chặn người dùng này?">
              <Button title={<EditOutlined />} />
            </Popconfirm>
            <Tooltip title="Xem chi tiết">
              <Button
                title={<EyeOutlined />}
                fill
                onClick={() =>
                  navigate(PATH.ADMIN_USER_DETAIL, { state: record })
                }
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const sorttedUserById = allUser?.items.sort((a, b) => a.id - b.id);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Table
        // loading={loading}
        dataSource={sorttedUserById}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserManagement;
