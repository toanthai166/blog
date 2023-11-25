import { Button, Checkbox, Form, Input } from "antd";

import { AuthLayout } from "../../layouts/auth-layout";
import { useCallback, useEffect } from "react";

import { useAuth } from "../../hooks/auth.hook.js";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    handleLogin,
    auth,
    mutation: { data, isLoading, isError, error },
  } = useAuth();

  useEffect(() => {
    if (auth) {
      navigate(AppRoutes.home);
    }
  }, [auth, navigate]);

  const onFinish = useCallback(() => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      handleLogin({ email: values.email, password: values.password });
    });
  }, [form, handleLogin]);

  return (
    <AuthLayout>
      <div className="flex justify-between mx-20 mt-10">
        {/* <LogoIcon /> */}
        <div>logo</div>

        <div className="flex gap-5">
          <div className="cursor-pointer text-14px mr-16px text-dim-gray">
            Bạn chưa có tài khoản?
          </div>
          <Button
            onClick={() => navigate(AppRoutes.register)}
            size="small"
            className="w-[87px] !h-[30px] !text-[12px] !font-medium leading-[16px]"
          >
            Đăng ký
          </Button>
        </div>
      </div>

      <div className="flex flex-col my-auto justify-center items-center mt-[150px]">
        <div className="text-28px font-semibold text-yankees-blue">
          Đăng nhập
        </div>
        <div className="mt-8px text-yankees-blue">Dành cho Khách hàng</div>
        <Form
          name="login"
          style={{ width: 580 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          {/* {errorMessage ? (
                  <div className="mt-[32px]">
                    <ResponseMessage error>{errorMessage}</ResponseMessage>
                  </div>
                ) : (
                  ""
                )} */}
          {/* {successMessage ? (
                  <div className="mt-[32px]">
                    <ResponseMessage success>{successMessage}</ResponseMessage>
                  </div>
                ) : (
                  ""
                )} */}
          <div className="mt-32px" />
          <div className="mb-[8px] font-medium text-14px text-yankees-blue">
            Email hoặc số điện thoại
          </div>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Đây là trường bắt buộc" },
              // {
              //   validator(_, value) {
              //     if (!value) return Promise.resolve();
              //     if (value.startsWith("0") && !value.includes("@")) {
              //       const validation = REGEX_PHONE.test(value);
              //       return validation
              //         ? Promise.resolve()
              //         : Promise.reject(
              //             new Error(errorLogin.invalidFormatPhone)
              //           );
              //     } else {
              //       const validation = REGEX_EMAIL.test(value);
              //       return validation
              //         ? Promise.resolve()
              //         : Promise.reject(
              //             new Error(errorLogin.invalidFormatEmail)
              //           );
              //     }
              //   },
              // },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="mt-[24px] mb-[8px] flex flex-row items-center justify-between">
            <div className="font-medium text-14px text-yankees-blue">
              Mật khẩu
            </div>
            <div
              className="text-14px text-yankees-blue underline cursor-pointer"
              //   onClick={onClickForgetPassword}
            >
              Quên mật khẩu?
            </div>
          </div>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="mt-[24px]"
          >
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>

          <Form.Item className="mt-[32px]">
            <Button
              type="default"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <div className="flex items-center justify-center mt-[32px] mb-[16px]">
            <div className="basis-1/3 w-full h-[1px] bg-[#EEEEEE]"></div>
            <div className="basis-1/3 text-center">
              <span className="text-grayscale-light text-[13px]">
                Hoặc đăng nhập bằng
              </span>
            </div>
            <div className="basis-1/3 w-full h-[1px] bg-[#EEEEEE]"></div>
          </div>
          <div className="flex justify-center items-center">
            {/* <GoggleIcon className="hover:cursor-pointer" />
                  <FacebookIcon className="mx-[12px] hover:cursor-pointer" />
                  <Apple className="hover:cursor-pointer" /> */}
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Login;
