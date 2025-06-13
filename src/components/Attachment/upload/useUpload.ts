import type { UploadRequestOptions } from 'element-plus'
import axios from 'axios'
import * as attachmentApi from '@/api/modules/common/attachment'

export function useUpload() {
  // 合并两种上传方式
  async function uploadRequest(options: UploadRequestOptions) {
    // 判断文件大小 2M 以下后端上传，2M 以上前端直传
    const sized = options.file.size > 1024 * 1024 * 5
    if (sized) {
      return uploadFile(options)
    }
    else {
      return uploadPreSignedUrl(options)
    }
  }
  // 第一种前端直传
  async function uploadPreSignedUrl(options: UploadRequestOptions) {
    const filename = generateFileName(options.file)
    // 生成预签名地址
    const { success, data } = await attachmentApi.getPresignedUrl(
      filename,
      options.file.type,
    )
    if (!success) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('获取预签名地址失败')
    }
    // 上传文件
    return axios
      .put(data.uploadUrl, options.file, {
        headers: {
          'Content-Type': options.file.type,
        },
      })
      .then(() => {
        // 上传后记录上传信息
        createFile(filename, options.file, data)
        return { data: data.accessUrl }
      })
  }

  // 第二种后端上传
  function uploadFile(options: UploadRequestOptions) {
    // 上传文件
    return new Promise((resolve, reject) => {
      attachmentApi
        .uploadFile(options.file)
        .then((res) => {
          if (!res.success) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('上传失败')
          }
          else {
            resolve({ data: res.data.permalink })
          }
        })
        .catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('上传失败')
        })
    })
  }
  // 纯文件上传
  async function uploadRequestFile(file: File) {
    // 判断文件大小 2M 以下后端上传，2M 以上前端直传
    const sized = file.size > 1024 * 1024 * 5
    if (sized) {
      return new Promise((resolve, reject) => {
        attachmentApi
          .uploadFile(file)
          .then((res) => {
            if (!res.success) {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(`上传失败:${res.msg}`)
            }
            else {
              resolve({ data: res.data.permalink })
            }
          })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('上传失败')
          })
      })
    }
    else {
      const filename = generateFileName(file)
      // 生成预签名地址
      const { success, data } = await attachmentApi.getPresignedUrl(
        filename,
        file.type,
      )
      if (!success) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('获取预签名地址失败')
      }
      // 上传文件
      return axios
        .put(data.uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
        .then(() => {
          // 上传后记录上传信息
          createFile(filename, file, data)
          return { data: data.accessUrl }
        })
    }
  }
  /**
   *  创建上传的文件信息
   * @param name
   * @param file
   */
  async function createFile(name: string, file: File, data: any) {
    const body = {
      displayName: name,
      mediaType: file.type,
      size: file.size,
      permalink: data.accessUrl,
    }
    await attachmentApi.createFile(body)
  }
  /**
   * 生成文件名
   * @param file
   */
  function generateFileName(file: File) {
  // 生成文件名
    const filename = `${file.name.substring(0, file.name.lastIndexOf('.'))}_${new Date().getTime()}`
    // 拼接后缀
    const ext = file.name.substring(file.name.lastIndexOf('.'))
    return `${filename}${ext}`
  }

  return {
    uploadRequest,
    uploadPreSignedUrl,
    uploadFile,
    uploadRequestFile,
  }
}
