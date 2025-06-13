export namespace Attachment{

  export interface ReqCreateFile {
    displayName: string
    mediaType: string
    size: number
    permalink: string
  }

  export interface ResCreateFile {
    id: number
    displayName: string
    mediaType: string
    size: number
    permalink: string
    createTime: string
  }

  export interface ReqGetPresignedUrl {
    filename: string
    mediaType: string
  }

  export interface ResGetPresignedUrl {
    objectKey: string
    uploadUrl: string
    accessUrl: string
  }
}
