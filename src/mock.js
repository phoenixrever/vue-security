const Mock = require("mockjs");

const Random = Mock.Random;

Mock.mock("http://localhost:8081/api/captcha", "get", () => {
  let result = {
    code: 0,
    message: "mock", //axios 拦截器会使用此消息报错
    captchaKey: "1234",
    captchaImage: Random.dataImage("100x35", "1234"),
  };
  return result;
});

//返回token
Mock.mock("http://localhost:8081/api/login", "post", () => {
  let result = {
    code: 0,
    message: "mock", //axios 拦截器会使用此消息报错
    token: Random.string(32),
  };
  return result;
});

let userInfo = {
  code: 0,
  message: "success",
  authUserInfo: {
    userId: 1,
    username: "admin",
    nickName: "管理员",
    gender: "男",
    phone: "18888888888",
    email: "201507802@qq.com",
    avatar: "none",
    enabled: 1,
    roleNames: null,
    permissions: [
      "user:list",
      "user:add",
      "user:edit",
      "user:delete",
      "role:list",
      "role:add",
      "role:edit",
      "role:delete",
      "menu:list",
      "menu:add",
      "menu:edit",
      "menu:delete",
    ],
    routers: [
      {
        name: "System",
        path: "/system",
        component: "Layout",
        redirect: {
          name: "User",
        },
        hidden: 0,
        isAlwaysShow: null,
        meta: {
          icon: "el-icon-s-tools",
          title: "系统管理",
        },
        children: [
          {
            name: "User",
            path: "user",
            component: "User",
            redirect: {
              name: "UserList",
            },
            hidden: 0,
            isAlwaysShow: null,
            meta: {
              icon: "el-icon-user-solid",
              title: "用户管理",
            },
            children: [
              {
                name: "UserList",
                path: "list",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tre",
                  title: "用户列表",
                },
                children: [],
              },
              {
                name: "UserAdd",
                path: "add",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "用户新增",
                },
                children: [],
              },
              {
                name: "UserEdit",
                path: "edit",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "用户编辑",
                },
                children: [],
              },
              {
                name: "UserDelete",
                path: "delete",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: null,
                  title: "用户删除",
                },
                children: [],
              },
            ],
          },
          {
            name: "Role",
            path: "role",
            component: "Role",
            redirect: {
              name: "RoleList",
            },
            hidden: 0,
            isAlwaysShow: null,
            meta: {
              icon: "el-icon-s-management",
              title: "角色管理",
            },
            children: [
              {
                name: "RoleList",
                path: "list",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "el-icon-s-order",
                  title: "角色列表",
                },
                children: [],
              },
              {
                name: "RoleAdd",
                path: "add",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "角色创建",
                },
                children: [],
              },
              {
                name: "RoleEdit",
                path: "edit",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "角色修改",
                },
                children: [],
              },
              {
                name: "RoleDelete",
                path: "delete",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "角色删除",
                },
                children: [],
              },
            ],
          },
          {
            name: "Menu",
            path: "menu",
            component: "Menu",
            redirect: {
              name: "MenuList",
            },
            hidden: 0,
            isAlwaysShow: null,
            meta: {
              icon: "el-icon-menu",
              title: "菜单管理",
            },
            children: [
              {
                name: "MenuList",
                path: "list",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "菜单列表",
                },
                children: [],
              },
              {
                name: "MenuAdd",
                path: "add",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "菜单新增",
                },
                children: [],
              },
              {
                name: "MenuEdit",
                path: "edit",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "菜单编辑",
                },
                children: [],
              },
              {
                name: "MenuDelete",
                path: "delete",
                component: null,
                redirect: null,
                hidden: 1,
                isAlwaysShow: null,
                meta: {
                  icon: "tree",
                  title: "菜单删除",
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

Mock.mock("http://localhost:8081/api/userInfo", "get", () => {
  return userInfo;
});
