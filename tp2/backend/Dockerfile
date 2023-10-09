# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /
COPY . .
RUN yarn install --production
CMD ["yarn", "build"]
EXPOSE 2023