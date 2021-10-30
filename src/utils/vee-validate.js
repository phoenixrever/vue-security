import { extend } from 'vee-validate'
import { email,required,confirmed } from 'vee-validate/dist/rules';

extend('email', {
  ...email,
  message: '请输入正确邮箱',
})
extend('required', {
  ...required,
  message: '不能为空'
});

extend('confirmed', {
  ...confirmed,
  message: '2次密码不一致'
});


