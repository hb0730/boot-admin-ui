# 容器部署

### Dockerfile

```dockerfile
FROM node:16.16.0 AS builder
WORKDIR application
RUN git clone https://gitee.com/yiming_chang/pure-admin-thin.git
RUN npm config set registry https://registry.npmjs.org
RUN npm install -g pnpm@6.33.1
RUN cd pure-admin-thin && pnpm install && pnpm build && ls

FROM nginx
COPY --from=builder application/pure-admin-thin/dist/ /usr/share/nginx/html/
EXPOSE 80 443
```

### build

```docker
docker build -t vue-test  --progress=plain --no-cache  .
```

### 启动

```docker
docker run -p 80:80 -d  vue-test
```

**仅供参考**
