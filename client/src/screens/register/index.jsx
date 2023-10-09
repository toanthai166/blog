import { Button, Form, Input } from "antd";

import { AuthLayout } from "../../layouts/auth-layout";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRegister } from "../../hooks/auth.hook.js";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    handleRegister,
    mutation: { data, isLoading },
  } = useRegister();

  useEffect(() => {
    if (data) navigate("/login");
  }, [data, navigate]);

  const onFinish = useCallback(() => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      handleRegister({
        email: values.email,
        password: values.password,
        name: values.fullname,
      });
    });
  }, [form, handleRegister]);

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
            //   onClick={onClickRegister}
            size="small"
            className="w-[87px] !h-[30px] !text-[12px] !font-medium leading-[16px]"
          >
            Đăng ký
          </Button>
        </div>
      </div>

      <div className="flex flex-col my-auto justify-center items-center mt-[150px]">
        <div className="text-28px font-semibold text-yankees-blue">Đăng kí</div>
        <div className="mt-8px text-yankees-blue"></div>
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
            Fullname
          </div>
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "dday la truong bat buoc" }]}
          >
            <Input />
          </Form.Item>
          <div className="mb-[8px] font-medium text-14px text-yankees-blue">
            Email
          </div>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "dday la truong bat buoc" }]}
          >
            <Input />
          </Form.Item>

          <div className="mt-[24px] mb-[8px] flex flex-row items-center justify-between">
            <div className="font-medium text-14px text-yankees-blue">
              Password
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
            rules={[{ required: true, message: "dday la truong bat buoc" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="mt-[32px]">
            <Button
              type="default"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
              block
            >
              Đăng kí
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

export default Register;
