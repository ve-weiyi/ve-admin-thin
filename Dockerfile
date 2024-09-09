FROM node:20-alpine as build-stage

WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN npm config set registry https://registry.npmmirror.com

COPY . .
RUN pnpm install
RUN pnpm build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/admin /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
