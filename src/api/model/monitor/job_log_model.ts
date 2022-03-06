import { BaseClass, BaseQuery } from "../domain";

export interface JobLogQuery extends BaseQuery {
  jobId?: string;
  jobName?: string;
  jobGroup?: string;
  status?: number;
  startTime?: string;
  endTime?: string;
}
export interface JobLog extends BaseClass {
  /**
   * 备注
   */
  description: string;

  /**
   * id
   */
  id: string;

  /**
   * 任务id
   */
  jobId: string;

  /**
   * 任务名称
   */
  jobName: string;

  /**
   * 任务组
   */
  jobGroup: string;

  /**
   * 调用目标
   */
  invokeTarget: string;

  /**
   * 日志信息
   */
  jobMessage: string;

  /**
   * 状态 0失败1成功
   */
  status: string;

  /**
   * 异常信息
   */
  exceptionInfo: string;
}
