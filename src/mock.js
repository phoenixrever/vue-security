const Mock = require("mockjs");

const Random = Mock.Random;

let result = {
  code: 0,
  message: "mock", //axios 拦截器会使用此消息报错
  data: "",
};

Mock.mock("http://localhost:8081/api/captcha", "get", () => {
  result.data = {
    token: Random.string(32),
    captchaImage: Random.dataImage("100x35", "1234"),
  };
  return result;
});

//返回token
Mock.mock("http://localhost:8081/api/login", "post", () => {
  result.data = {
    token: Random.string(32),
  };
  return result;
});

let userInfo = {
  message: "success",
  success: true,
  code: 0,
  data: {
    name: "Uncle",
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F25%2F20171025143543_wPfrC.gif&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638672654&t=cee8eb4215201a24938b07d05e4005d2",
    roles: ["admin"],
    routers: [
      {
        name: "Test_It",
        path: "/test",
        component: "Layout",
        meta: {
          icon: "el-icon-lock",
          title: "test",
        },
        children: [
          {
            name: "test1",
            path: "test1",
            component: "Test",
            meta: {
              icon: "el-icon-delete",
              title: "test1",
            },
          },
          {
            name: "test2",
            path: "test2",
            component: "Test2",
            meta: {
              icon: "el-icon-s-tools",
              title: "test2",
            },
          },
        ],
      },
    ],
  },
};

Mock.mock("http://localhost:8081/api/userInfo", "get", () => {
  console.log(userInfo);
  return userInfo;
});
