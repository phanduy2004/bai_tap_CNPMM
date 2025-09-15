import React, { useContext, useState } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  ShoppingCartOutlined, // 👈 thêm icon giỏ hàng
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">> check auth: ", auth);

  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/products">Products</Link>,
      key: "products",
      icon: <SettingOutlined />,
    },
    {
      label: <Link to="/cart">Cart</Link>, // 👈 thêm tab giỏ hàng
      key: "cart",
      icon: <ShoppingCartOutlined />,
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/user">Users</Link>,
            key: "user",
            icon: <UsergroupAddOutlined />,
          },
        ]
      : []),
    {
      label: "Welcome " + (auth.user?.email ?? ""),
      key: "SubMenu",
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.clear("access_token");
                      setAuth({
                        isAuthenticated: false,
                        user: {
                          email: "",
                          name: "",
                        },
                      });
                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
              },
            ]
          : []),
        {
          label: <Link to="/login">Đăng nhập</Link>,
          key: "login",
        },
      ],
    },
  ];

  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
