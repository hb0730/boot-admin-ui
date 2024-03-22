import { isEmail, isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { deptExistsCode } from "@/api/sys/dept";

const formData = ref();

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  code: [
    { required: true, message: "部门编码为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入部门编码"));
          return;
        }
        const { success, data } = await deptExistsCode(
          value,
          formData.value?.id ?? ""
        );
        if (success && data) {
          callback(new Error("部门编码已存在"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  name: [{ required: true, message: "部门名称为必填项", trigger: "blur" }],
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
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
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
