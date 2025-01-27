export type ResourceCommitBody = {
    resourceName:string,
    resourceDescription:string,
    majorId:number,
    type:number
    requirePoint:number,
    downloadUrl:number,
    fileSize:number,
    fileType:string,
    userDefineTagList:string[],
    defaultResourceTagId:number
}
