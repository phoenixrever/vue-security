const Mock = require("mockjs")

const Random= Mock.Random

let result={
  code:200,
  message:"ok",  //axios 拦截器会使用此消息报错
  data:""
}

Mock.mock("/api/captcha","get",()=>{
  result.data={
    token:Random.string(32),
    captchaImage:Random.dataImage('100x35', '1234')
  }
  return result
})
Mock.mock("/api/login","post",()=>{
  result.data={
    token:Random.string(32),
  }
  return result
})

let userInfo={
  "message": "success",
  "success": true,
  "code": 200,
  "data": {
    "name": "Uncle",
    "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    "roles": ["admin"],
    "routers": [{
      "name": "Test_It",
      "path": "/test",
      "component": "Layout",
      "meta": {
        "icon": "el-icon-lock",
        "title": "test"
      },
      "children": [{
        "name": "test1",
        "path": "test1",
        "component": "Test",
        "meta": {
          "icon": "el-icon-delete",
          "title": "test1"
        }
      },
        {
          "name": "test2",
          "path": "test2",
          "component": "Test2",
          "meta": {
            "icon": "el-icon-s-tools",
            "title": "test2"
          }
        }
      ]
    }]
  }
}

Mock.mock("/api/userInfo","get",()=>{
  return userInfo
})
