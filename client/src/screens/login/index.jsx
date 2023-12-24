import { Button, Checkbox, Form, Input, notification } from "antd";

import { AuthLayout } from "../../layouts/auth-layout";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../../hooks/auth.hook.js";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import { REGEX_EMAIL, REGEX_PASSWORD } from "../../helpers/regex.js";
import {
  Apple,
  FacebookIcon,
  GoogleIcon,
  RadioInput,
} from "../../assets/index.js";
export const PASSWORD_MIN_LENGTH = 6;

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const [form] = Form.useForm();
  const {
    handleLogin,
    auth,
    error,
    mutation: { isLoading },
  } = useAuth();

  useEffect(() => {
    if (auth) {
      navigate(AppRoutes.home);
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (error !== undefined) {
      notification.error({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
      form.resetFields();
    }
  }, [error, form]);

  useEffect(() => {
    if (password) {
      const isSpace = password.includes(" ");
      if (isSpace) {
        notification.error({
          message: `Mật khẩu hợp lệ không chứa khoảng trắng`,
          description: "Vui lòng kiểm tra lại!",
        });
      }
    }
  }, [password]);

  const onFinish = useCallback(() => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      handleLogin({ email: values.email, password: values.password });
    });
  }, [form, handleLogin]);

  const validatePasswordLength = () => {
    return password.length >= PASSWORD_MIN_LENGTH;
  };

  const validatePasswordRegex = () => {
    return REGEX_PASSWORD.test(password);
  };

  const validatePasswordHasNoSpace = () => {
    return password && !password.includes(" ");
  };

  const validatePassword = () => {
    return (
      validatePasswordHasNoSpace() &&
      validatePasswordLength() &&
      validatePasswordRegex()
    );
  };

  return (
    <AuthLayout>
      <div className="flex justify-between mx-20 mt-10">
        <Button type="link" onClick={() => navigate(AppRoutes.home)}>
          <img
            src="../../public/image/blog-am-thuc.png"
            alt=""
            className="w-20 h-20 "
          />
        </Button>

        <div className="flex gap-5">
          <div className="cursor-pointer text-14px mr-16px text-dim-gray">
            Bạn chưa có tài khoản?
          </div>
          <Button
            type="primary"
            onClick={() => navigate(AppRoutes.register)}
            size="small"
            className="w-[87px] !h-[30px] !text-[12px] !font-medium leading-[16px]"
          >
            Đăng ký
          </Button>
        </div>
      </div>

      <div className="flex flex-col my-auto justify-center items-center mt-[150px]">
        <div className="text-3xl font-semibold text-yankees-blue mb-10">
          Đăng nhập
        </div>
        <Form
          name="login"
          style={{ width: 580 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          <div className="mt-32px" />
          <div className="mb-[8px] font-medium text-14px text-yankees-blue">
            Email
          </div>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email là trường bắt buộc" },
              {
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  const validation = REGEX_EMAIL.test(value);
                  return validation
                    ? Promise.resolve()
                    : Promise.reject(new Error("Email chưa đúng định dạng"));
                },
              },
            ]}
            normalize={(e) => e.trimStart()}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <div className="mt-[24px] mb-[8px] flex flex-row items-center justify-between">
            <div className="font-medium text-14px text-yankees-blue">
              Mật khẩu
            </div>
            <div className="text-14px text-yankees-blue underline cursor-pointer">
              Quên mật khẩu?
            </div>
          </div>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Mật khẩu là trường bắt buộc" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <h2 className="mt-2">Mật khẩu hợp lệ bao gồm</h2>
          <div className="space-x-1 flex flex-2">
            <RadioInput
              className="translate-y-1 "
              fill={`${validatePasswordLength() ? "#1BB045" : "#A4A4AE"}`}
            />
            <span>Tối thiểu 6 kí tự</span>
          </div>
          <div className="space-x-1 flex flex-2">
            <RadioInput
              className="translate-y-1"
              fill={`${validatePasswordRegex() ? "#1BB045" : "#A4A4AE"}`}
            />
            <span>Bao gồm chữ cái và số</span>
          </div>
          <div className="space-x-1 flex flex-2">
            <RadioInput
              className="translate-y-1"
              fill={`${validatePasswordHasNoSpace() ? "#1BB045" : "#A4A4AE"}`}
            />
            <span>Không chứa khoảng trắng</span>
          </div>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="mt-[24px]"
          >
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>

          <Form.Item className="">
            <Button
              type="primary"
              className=""
              htmlType="submit"
              disabled={!validatePassword() || isLoading}
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
            <GoogleIcon className="hover:cursor-pointer" />
            <FacebookIcon className="mx-[12px] hover:cursor-pointer" />
            <Apple className="hover:cursor-pointer" />
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Login;
