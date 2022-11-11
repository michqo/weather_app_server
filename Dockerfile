FROM debian:bullseye as builder

ARG NODE_VERSION=16.18.0

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}
RUN npm install -g pnpm

#######################################################################

RUN mkdir /app
WORKDIR /app

COPY . .

RUN pnpm install && pnpm run build
FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app/dist
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "node", "server.js" ]
