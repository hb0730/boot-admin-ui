import type { FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { validateCron } from "@/api/sys/timing";

const formData = ref();
/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  jobName: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  jobClassName: [
    { required: true, message: "请输入任务类名/Bean名称", trigger: "blur" }
  ],
  cronExpression: [
    { required: true, message: "请输入cron表达式", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入cron表达式"));
        }
        const { success, message } = await validateCron(value);
        if (!success) {
          return callback(new Error(message));
        }
        callback();
      },
      trigger: "blur"
    }
  ]
});

export function useFormRules(data) {
  formData.value = data;
  return formRules;
}
