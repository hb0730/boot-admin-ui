FROM nginx:stable-alpine as production-stage

COPY dist.tar.gz /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
