FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV OPENAI_API_KEY=
ENV GLADIA_TOKEN=
ENV MATRIX_HOST=
ENV MATRIX_USER_ID=
ENV MATRIX_USER_ACCESS_TOKEN=
ENV MATRIX_BOT_ID=
ENV MATRIX_BOT_ACCESS_TOKEN=
ENV MATRIX_CHANNEL_ID=

CMD [ "pnpm", "run", "prod" ]