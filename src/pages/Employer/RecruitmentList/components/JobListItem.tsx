import { Badge, Button, Dropdown, List, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import icons from '~/utils/icons';
import { JobPosting } from '../RecruitmentList';

import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import PATH from '~/utils/path';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const {
  DollarCircleOutlined,
  MoreOutlined,
  DesktopOutlined,
  UsergroupAddOutlined,
  CalendarFilled,
  UserOutlined,
  EyeOutlined,
  FilePdfOutlined,
  RightCircleOutlined,
  DeleteOutlined,
} = icons;

const formatSalaryRange = (min: number | null, max: number | null) => {
  if (!min && !max) return 'Thương lượng';
  if (!min) return `Tối đa ${max?.toLocaleString('vi-VN')}đ`;
  if (!max) return `Tối thiểu ${min?.toLocaleString('vi-VN')}đ`;
  return `${min?.toLocaleString('vi-VN')}đ - ${max?.toLocaleString('vi-VN')}đ`;
};

interface JobListItemProps {
  item: JobPosting;
}

const JobListItem: React.FC<JobListItemProps> = ({ item }) => {
  const navigate = useNavigate();
  return (
    <List.Item
      key={item.id}
      className="bg-white rounded-lg shadow-sm border border-gray-100"
      extra={
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: 'Xem tin đã đăng',
                icon: <EyeOutlined />,
                onClick: () => window.open(`/job/${item.id}`, '_blank'),
              },
              {
                key: '2',
                label: 'Xem mô tả',
                icon: <FilePdfOutlined />,
                onClick: () => navigate(PATH.UPDATE_JOB, { state: item }),
              },
              {
                key: '3',
                label: 'Dừng đăng tin',
                icon: <RightCircleOutlined />,
              },
              {
                key: '4',
                label: 'Xóa tin',
                icon: <DeleteOutlined />,
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="text-gray-400"
          />
        </Dropdown>
      }
    >
      <div className="w-full p-2">
        <Tag color="success" className="flex gap-2 mb-2 w-fit">
          <Badge color="green" className="rounded-full" />
          <p>{item.jobstatus}</p>
        </Tag>

        <h3 className="text-sm font-medium mb-1">{item.jobTitle}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>
            <UserOutlined />
          </span>
          <span className="mx-2 text-sm">{item.userFullName}</span>
          <span className="text-sm">• {dayjs(item.jobCreateAt).fromNow()}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Tag
            className="font-bold"
            icon={<DollarCircleOutlined />}
            color="green"
          >
            {formatSalaryRange(item.jobSalaryMin, item.jobSalaryMax)}
          </Tag>
          <Tag className="font-bold" color="purple" icon={<CalendarFilled />}>
            {item.jobCategoryName}
          </Tag>
          <Tag className="font-bold" icon={<DesktopOutlined />} color="orange">
            {item.workTypeTitle}
          </Tag>
          <Tag
            className="font-bold"
            icon={<UsergroupAddOutlined />}
            color="yellow"
          >
            {item.jobQuantity}
          </Tag>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="flex items-center">
            Đang đánh giá{' '}
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.evaluatingCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center">
            Phỏng vấn{' '}
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.interviewingCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center">
            Đang offer{' '}
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.offeringCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center text-green-600">
            Đã tuyển{' '}
            <Tag className="ml-1 bg-[#52c41a] text-white">
              {item.recruitingCount}
            </Tag>
          </span>
          <span className="flex items-center text-gray-400">
            Đã đóng <Tag className="ml-1">{item.recruitingCount}</Tag>
          </span>
        </div>
      </div>
    </List.Item>
  );
};

export default JobListItem;
