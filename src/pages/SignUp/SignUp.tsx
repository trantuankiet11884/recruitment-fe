import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Col, Divider, Layout, Row, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from '~/hooks/useStore';
import { signInWithGoogle } from '~/store/thunk/auth';
import FormSignUp from './FormSignUp';
import { useForm } from 'antd/es/form/Form';

const { Title, Paragraph } = Typography;

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleSignInWithGoogleSuccess = (response: CredentialResponse) => {
    try {
      const token = response.credential;
      if (!token) return;

      const decodedToken: any = jwtDecode(token);
      dispatch(signInWithGoogle(decodedToken));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="w-full min-h-[100vh] px-8 justify-center items-center">
      <Row justify={'center'} align={'middle'} className="flex gap-x-32">
        <Col className="flPex flex-col justify-center items-start max-w-md">
          <Title level={2} className="text-gray-700 !mb-0">
            Chào mừng đến với
          </Title>
          <Title level={1} className="text-blue-600 !mt-0 mb-4">
            Tuyển dụng ABC
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Nền tảng tìm việc hàng đầu cho sự nghiệp của bạn
          </Paragraph>
        </Col>
        <Col>
          <div className="flex flex-col gap-y-6 bg-white p-6 border rounded-xl shadow-md">
            <div className="w-full">
              <h1 className="text-base font-semibold">
                Đăng ký cho Người tìm việc
              </h1>
              <p className="text-sm text-sub mt-1">
                Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
              </p>
            </div>
            <div className="flex w-full justify-center">
              <GoogleLogin onSuccess={handleSignInWithGoogleSuccess} />
            </div>
            <Divider className="!my-0">
              <p className="text-sub text-sm">hoặc</p>
            </Divider>
            <FormSignUp form={form} onFinish={handleFinish} />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default SignUp;