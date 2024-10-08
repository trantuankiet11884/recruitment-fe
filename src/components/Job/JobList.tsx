import { List } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useMemo, useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { BlockChain, PortFolio } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import {
  JobItem,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import FormItem from '../Form/FormItem';
import CustomSelect from '../Select/CustomSelect';
import TopSearchBar from '../TopSearchBar/TopSearchBar';
import JobCard from './JobCard';

export interface IParams {
  page: number;
  pageSize: number;
  salaryMin?: number;
  salariMax?: number;
  categoriesId?: number;
  jobFieldsId?: number;
  placmentsId?: number;
  workTypesId?: number;
  title?: string;
}

const optionsExperience: DefaultOptionType[] = [
  {
    label: 'Tất cả mức lương',
    value: 'all',
  },
  {
    label: 'Dưới 10 triệu',
    value: 'less',
  },
  {
    label: '10 - 20 triệu',
    value: 'less than 1 year',
  },
  {
    label: '23 - 30 triệu ',
    value: '1-3 year',
  },
];

const JobListPage = () => {
  const { allJobs, loading } = useAppSelector((state) => state.jobs);
  const [filters, setFilters] = useState<
    Partial<Omit<IParams, 'page' | 'pageSize'>>
  >({});

  const { currentPage, itemsPerPage, handlePageChange } = usePagination<
    JobItem,
    IParams
  >({
    fetchAction: getAllJobs,
    pageInfo: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: allJobs?.pageInfo?.totalItems || 0,
    },
    items: allJobs?.items,
    extraParams: filters,
  });

  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<PaginatedWorkTypes>(
    JobsAPI.getAllWorkTypes
  );
  const { data: jobFields } = useFetch<PaginatedJobFields>(
    JobsAPI.getAllJobFields
  );

  const jobCategoriesOptions = useMemo(
    () => [
      { label: 'Tất cả loại hình', value: 'all' },
      ...(jobCategories?.items?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []),
    ],
    [jobCategories]
  );

  const workTypeOptions = useMemo(
    () => [
      { label: 'Tất cả hình thức', value: 'all' },
      ...(workType?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [workType]
  );

  const jobFieldsOptions = useMemo(
    () => [
      { label: 'Tất cả lĩnh vực', value: 'all' },
      ...(jobFields?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [jobFields]
  );

  const handleSearch = (values: IParams) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value && value !== 'all')
    ) as Partial<IParams>;

    setFilters(cleanedFilters);
    handlePageChange(1);
  };

  const handleFilterChange = (values: IParams) => {
    handleSearch(values);
  };

  return (
    <div className="w-full">
      <TopSearchBar
        onSearch={handleFilterChange}
        placeHolder="Vị trí công việc"
      >
        <FormItem
          childrenSelected
          name="workTypesId"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={workTypeOptions}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="categoriesId"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobCategoriesOptions}
            prefixIcon={<PortFolio className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsExperience}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="jobFieldsId"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobFieldsOptions}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
      </TopSearchBar>
      <div className="container mx-auto px-4">
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={allJobs?.items}
          renderItem={(job) => (
            <List.Item className="mb-4">
              <JobCard {...job} />
            </List.Item>
          )}
          pagination={
            allJobs && allJobs?.items?.length
              ? {
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: allJobs?.pageInfo?.totalItems,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                }
              : false
          }
        />
      </div>
    </div>
  );
};

export default JobListPage;
