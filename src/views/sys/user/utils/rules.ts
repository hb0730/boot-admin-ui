import { isEmail, isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { existsByUsername } from "@/api/sys/user";

const formData = ref();
/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [
    { required: true, message: "用户账号为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入用户账号"));
        }
        const { success, data } = await existsByUsername(
          value,
          formData?.value?.id ?? ""
        );
        if (success) {
          if (data) {
            callback(new Error("用户账号已存在"));
          } else {
            callback();
          }
        } else {
          callback(new Error("用户账号校验失败"));
        }
      },
      trigger: "blur"
    }
  ],
  nickname: [{ required: true, message: "用户昵称为必填项", trigger: "blur" }],
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export function useFormRule(data: any) {
  formData.value = data;
  return formRules;
}
