FROM node:current-alpine AS build

WORKDIR /srv

COPY ./package*.json /srv/

RUN npm install

COPY ./.eslintrc.js ./.prettierrc ./nest-cli.json ./tsconfig*.json /srv/

COPY ./src /srv/src

RUN npm run build


FROM node:current-alpine AS production

WORKDIR /srv

EXPOSE 3000

CMD [ "/usr/local/bin/npm", "run", "start:prod" ]

COPY ./package*.json /srv/

RUN npm install --omit dev

COPY --from=build /srv/dist /srv/dist
