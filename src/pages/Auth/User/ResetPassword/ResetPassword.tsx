import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserAPI, { IResetPasswordParams } from '~/apis/user';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import InputPassword from '~/components/Input/InputPassword';
import CongratulationModal from '~/components/Modal/CongratulationModal';
import { useMessage } from '~/contexts/MessageProvider';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signIn } from '~/store/thunk/auth';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { LockOutlined } = icons;

interface IForm {
  password: string;
  reEnterPassword: string;
}

const ResetPassword = () => {
  const [form] = useForm<IForm>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { messageApi } = useMessage();
  const { queryParams } = useQueryParams();

  const email = queryParams.get('email');
  const token = queryParams.get('token');

  const { currentUser } = useAppSelector((state) => state.auth);
  const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (params: IResetPasswordParams) => UserAPI.resetPassword(params),
    onSuccess: () => {
      setIsResetPasswordSuccess(true);

      if (!email) {
        messageApi.error('Có lỗi xảy ra: Không tìm thấy email');
        return;
      }

      const { password } = form.getFieldsValue();
      setTimeout(() => {
        dispatch(signIn({ email, password }));
      }, 3000);
    },
    onError: (error: any) => messageApi.error(error?.response?.data?.message),
  });

  useEffect(() => {
    if (!email || !token) navigate(PATH.ROOT);
  }, [email, token]);

  useEffect(() => {
    if (!currentUser || !Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success('Đăng nhập thành công'), navigate(PATH.ROOT))
      : toast.error('Có lỗi xảy ra');
  }, [currentUser]);

  const handleFinish = useCallback(
    (values: IForm) => {
      if (!email || !token) {
        toast.error('Có lỗi xảy ra: Không tìm thấy email');
        return;
      }

      if (values.password !== values.reEnterPassword) {
        form.setFields([
          {
            name: 'reEnterPassword',
            errors: ['"Nhập lại mật khẩu" phải trùng với "Mật khẩu"'],
          },
        ]);
        return;
      }

      const params: IResetPasswordParams = {
        email,
        token,
        password: values.password,
      };
      resetPassword(params);
    },
    [email, token]
  );

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Đặt lại mật khẩu</h2>
        <p className="text-sm text-sub">
          Vui lòng đặt lại mật khẩu mới cho tài khoản của bạn
        </p>
      </div>
      <FormWrapper
        form={form}
        loading={isPending}
        onFinish={handleFinish}
        submitTitle="Xác nhận"
      >
        <FormItem
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <InputPassword
            placeholder="Tối thiểu 8 ký tự"
            prefix={<LockOutlined />}
          />
        </FormItem>
        <FormItem
          name="reEnterPassword"
          label="Nhập lại mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu' }]}
        >
          <InputPassword
            placeholder="Tối thiểu 8 ký tự"
            prefix={<LockOutlined />}
          />
        </FormItem>
      </FormWrapper>
      <CongratulationModal isOpen={isResetPasswordSuccess} footer={<></>}>
        <div className="text-center space-y-3">
          <h2 className="text-lg font-semibold">Mật khẩu đã được cập nhật</h2>
          <p className="text-sm text-sub font-medium">
            Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của mình
          </p>
        </div>
        <p className="text-sm text-green-500 animate-pulse">
          Đang tự động chuyển hướng...
        </p>
      </CongratulationModal>
    </>
  );
};

export default ResetPassword;
