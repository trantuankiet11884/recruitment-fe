import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';

import { useEffect, useState } from 'react';
import UserApi, { ILanguageParams } from '~/apis/user';
import FormItem from '~/components/Form/FormItem';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import useMessageApi from '~/hooks/useMessageApi';
import { UserLanguage } from '~/types/User';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: UserLanguage;
  refetch: () => void;
  onCancel: () => void;
}

export const advanceOptions: DefaultOptionType[] = [
  { label: 'Sơ cấp', value: '1' },
  { label: 'Giao tiếp cơ bản', value: '2' },
  { label: 'Giao tiếp chuyên nghiệp', value: '3' },
  { label: 'Hoàn toàn thành thạo', value: '4' },
];

const LanguageModal = ({ isOpen, data, refetch, onCancel }: IProps) => {
  const [form] = useForm();

  const { data: languages } = useFetch(UserApi.getAllForeignLanguage);
  const { mutate: createUserLanguage, isPending } = useMessageApi({
    apiFn: (params: ILanguageParams) => UserApi.createForeignLanguage(params),
    onSuccess: () => {
      refetch();
    },
  });

  const [languageOptions, setLanguageOptions] = useState<DefaultOptionType[]>(
    []
  );

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: any) => {
    const params: ILanguageParams = {
      foreignLanguagesId: values.language,
      level: Number(values.advanced),
    };

    createUserLanguage(params);
    handleCancel();
  };

  useEffect(() => {
    if (!Object.keys(data).length) {
      form.setFieldValue('advanced', '2');
      return;
    }

    const fieldsValue = {
      language: data.foreignLanguagesId,
      advanced: data.level?.toString(),
    };
    form.setFieldsValue(fieldsValue);
  }, [data]);

  useEffect(() => {
    if (!languages) return;

    const options: DefaultOptionType[] = languages?.items.map((language) => ({
      label: language.title,
      value: language.id,
    }));

    setLanguageOptions(options);
  }, [languages]);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isPending}
      title="Cập nhật tóm tắt"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="language"
        label="Ngoại ngữ"
        rules={[{ required: true, message: 'Hãy chọn ngoại ngữ của bạn' }]}
      >
        <Select allowClear options={[]} placeholder="Chọn loại ngoại ngữ" />
      </FormItem>
      <FormItem
        name="advanced"
        label="Trình độ"
        rules={[{ required: true, message: 'Hãy trình độ của bạn' }]}
      >
        <Select
          allowClear
          options={advanceOptions}
          placeholder="Chọn trình độ"
        />
      </FormItem>
    </ProfileModal>
  );
};

export default LanguageModal;
