import { Form, FormInstance } from 'antd';
import { Link } from 'react-router-dom';

import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import { emailRegex, passwordRegex } from '~/utils/constant';
import PATH from '~/utils/path';

interface IProps {
  form: FormInstance<any>;
  onFinish(values: any): void;
  loading: boolean;
}

const FormSignUp = ({ form, onFinish, loading }: IProps) => {
  return (
    <>
      <FormWrapper
        form={form}
        submitTitle="Đăng ký"
        onFinish={onFinish}
        loading={loading}
      >
        <Form.Item
          name="fullName"
          label="Chúng tôi nên gọi bạn là gì?"
          rules={[{ required: true, message: 'Họ và tên không được để trống' }]}
        >
          <Input name="fullName" placeholder="Nguyễn Văn A" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Địa chỉ email"
          rules={[
            { required: true, message: 'Hãy nhập email' },
            { pattern: emailRegex, message: 'Email không hợp lệ' },
          ]}
        >
          <Input name="email" placeholder="abc@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Hãy nhập mật khẩu' },
            {
              pattern: passwordRegex,
              message: 'Mật khẩu phải có ít nhất 8 ký tự',
            },
          ]}
        >
          <InputPassword name="password" placeholder="Nhập mật khẩu" />
        </Form.Item>
      </FormWrapper>
      <div className="flex gap-x-1">
        <span>Đã có tài khoản?</span>
        <Link
          to={PATH.SIGN_IN}
          className="font-semibold text-end text-[#2563eb] hover:underline hover:text-[#2563eb]"
        >
          Đăng nhập tại đây.
        </Link>
      </div>
    </>
  );
};

export default FormSignUp;
