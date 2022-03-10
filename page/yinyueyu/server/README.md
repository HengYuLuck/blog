####结构
> server.js > 创建http/https代理,创建websocket代理
>> server_action.js > 分配get/post方式的响应
>>>server_action_get > 遍历目录存入变量
>>>* fn 遍历目录
>>>* fn 压缩文件
>>>- 判断文件类型
>>>- 普通http,css,js,img...文件
>>>- 媒体文件
>>>- djs文件(自定的动态响应)