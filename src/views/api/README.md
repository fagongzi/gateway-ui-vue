# 接口列表

## 字段说明
### id
API的ID，唯一标识一个API。

### name
接口的名称。

### urlPattern
URL匹配模式，使用正则表达式表示。Gateway使用该字段来匹配原始请求的URL。该字段必须和Method配合使用，同时满足才算这个请求匹配了这个API。

### method
HTTP Method， * 匹配所有的HTTP Method（GET,PUT,POST,DELETE）。该字段必须和URLPattern配合使用，同时满足才算这个请求匹配了这个API。

### domain(可选)
host，当原始请求的host等于该值，则认为匹配了当前的API，同时忽略URLPattern和Method。

### status
API 状态枚举, 有2个值组成： UP 和 Down。只有UP状态才能生效。

### ipAccessControl(可选)
IP的访问控制，有黑白名单2个部门组成。

### defaultValue（可选）
API的默认返回值，当后端Cluster无可用Server的时候，Gateway将返回这个默认值，默认值由Code、HTTP Body、Header、Cookie组成。可以用来做Mock或者后端服务故障时候的默认返回。

### nodes
请求被转发到的后端Cluster。至少设置一个转发Cluster，一个请求可以被同时转发到多个后端Cluster（目前仅支持GET请求设置多个转发）。在转发的时候，针对每一个转发支持以下特性：

#### 支持URL 重写
例如，API对外提供的URL是/api/users/1，后端真实server提供的URL是/users?id=1，类似这种情况需要对原始URL进行重写。 对于这个重写，我们需要配置API的URLPattern属性为/api/users/(\d+)，并且配置转发的URL重写规则为：users?id=$1

#### 支持对原始请求的参数校验

支持针对querystring、json body、cookie、header、path value中的任意属性配置正则表达式的校验规则

#### 聚合多个后端Cluster的响应，统一返回

支持一个请求被同时分发到多个后端Cluster，并且为每一个后端Cluster返回的数据设置一个属性名，并且聚合所有的返回值作为一个JSON统一返回。例如：一个前端APP的页面需要显示用户账户信息以及用户的基本信息，可以使用这个特性，定制一个API/api/users/(\d+)，同时配置分发到2个后端Cluster，并且配置URL的重写规则为/users/base/$1和/users/account/$1，这样聚合2个信息返回。并且支持依赖转发，首先请求一个后端api得到返回的结果，并且使用返回结果的某一属性作为下次请求的参数。例如定制一个API/api/users/(\d+)，聚合后端2个服务/users/base/$1和/users/account/$user.accountId，那么可以设置/users/account/$user.accountId转发的BatchIndex为1，那么/users/account/$user.accountId会在/users/base/$1返回之后再转发，并且替换$user.accountId为返回的值。


#### 支持失败重试

可以设置retryStrategy指定根据http返回码重试请求，可以设置重试最大次数以及重试间隔。



#### 支持API级别的超时时间覆盖全局设置

可以设置ReadTimeout和WriteTimeout来指定请求的读写超时时间，不设置默认使用全局设置。





### perms(可选)
设置访问这个API需要的权限，需要用户自己开发权限检查插件。


### authFilter（可选）
指定该API所使用的Auth插件名称，Auth插件的实现可以借鉴JWT插件

### renderTemplate

使用RenderTemplate可以重新定义返回的数据，包括数据的格式，字段等等。


### useDefault (可选)
当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。

### matchRule （可选）

matchRule |  logic
----- | -----
matchDefault | Domain \|\| (URLPattern && Method)
matchAll | Domain && URLPattern && Method
matchAny | Domain \|\| URLPattern \|\| Method

### position （可选）
API匹配时按该值的升序匹配，即值越小优先级越高。默认值为0。

### tags (可选)

给API加上Tag标签，便于维护和检索。

### webSocketOptions (可选)

websocket选项，设置该API为websocket，注意：websocket特性还处于试验阶段，默认关闭，可以使用--websocket启用特性。网关转发websocket的时候，Origin默认使用后端Server的地址，如果需要设置特殊值，可以指定Origin参数。



接口IP的访问控制 ： IP白名单，IP黑名单

