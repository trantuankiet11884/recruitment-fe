import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table } from 'antd';
import React from 'react';
import icons from '~/utils/icons';

const { FilePdfOutlined } = icons;

const CandicateDashboard: React.FC = () => {
  const stats = [
    { title: 'Số lượng ứng viên mới', value: 0 },
    { title: 'Ứng viên tự ứng tuyển', value: 0 },
    { title: 'Ứng viên được chia sẻ', value: 0 },
    { title: 'Ứng viên từ nguồn khác', value: 0 },
  ];

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'title',
    },
    {
      title: 'Ứng viên',
      dataIndex: ['user', 'fullName'],
    },
    {
      title: 'Ngày ứng tuyển',
      dataIndex: 'applicationDeadline',
    },
    {
      title: 'Địa điểm',
      dataIndex: ['jobsPlacements'],
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Hành động',
      render: () => <FilePdfOutlined />,
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="text-center shadow-md">
              <p className="text-gray-600 mb-2">{stat.title}</p>
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-green-500 flex items-center justify-center">
                <ArrowUpOutlined />
                <span className="ml-1">+0% so với tháng trước</span>
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-6 text-center shadow-md">
        <Table columns={columns} dataSource={[]} className="mb-4" />
      </Card>
    </div>
  );
};

export default CandicateDashboard;
