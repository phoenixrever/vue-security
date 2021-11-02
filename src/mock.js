const Mock = require("mockjs")

const Random= Mock.Random

let result={
  code:200,
  message:"ok",  //axios 拦截器会使用此消息报错
  data:""
}

Mock.mock("/api/captcha","get",()=>{
  console.log("mock");
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
