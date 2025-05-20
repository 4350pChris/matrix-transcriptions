FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . /app
RUN pnpm run build

FROM base
COPY package.json /app/
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV GLADIA_TOKEN=
ENV DEEPGRAM_API_KEY=
ENV FALAI_API_KEY=
ENV MATRIX_HOST=
ENV MATRIX_USER_ID=
ENV MATRIX_USER_ACCESS_TOKEN=
ENV MATRIX_BOT_ID=
ENV MATRIX_BOT_ACCESS_TOKEN=
ENV MATRIX_CHANNEL_ID=

CMD [ "pnpm", "run", "prod" ]
