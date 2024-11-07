import { Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { IJob } from '~/types/Job';

const JobManagement: React.FC = () => {
  const { data: allJobs } = useFetch<IJob>(JobsAPI.getAllJobs);

  const currentPage = allJobs?.pageInfo?.currentPage || 1;
  const pageSize = allJobs?.pageInfo?.itemsPerPage || 10;

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tiêu đề công việc',
      dataIndex: 'title',
      className: 'font-bold',
    },
    {
      title: 'Tên công ty',
      dataIndex: ['user', 'companyName'],
    },
    {
      title: 'Vị trí',
      dataIndex: ['jobPosition', 'title'],
    },
    {
      title: 'Số lượng ứng tuyển',
      dataIndex: 'quantity',
    },
    {
      title: 'Hình thức làm việc',
      dataIndex: ['workType', 'title'],
    },
    {
      title: 'Khu vực',
      render: (record: any) =>
        record?.jobsPlacements
          ?.map((item: any) => item?.placement?.title)
          .join(', '),
    },
    {
      title: 'Ngày đăng tin',
      dataIndex: 'createAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:MM'),
    },
    // {
    //   title: 'Hành động',
    //   key: 'actions',
    //   render: () => (
    //     <Space>
    //       <Popconfirm title="Are you sure to delete?">
    //         <Button title="Delete" fill />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
      <Table
        // loading={loading}
        dataSource={allJobs?.items}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default JobManagement;