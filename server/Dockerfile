
FROM node:14-alpine3.12

WORKDIR /usr/src/app
#COPY tsconfig.json /app/tsconfig.json
#COPY tslint.json /app/tslint.json
COPY package*.json ./
RUN npm install 
#RUN npm install --arch=arm64 --platform=linuxmusl sharp
#RUN rm -r node_modules/sharp

#RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm_config_arch=x64 npm_config_platform=linuxmusl install sharp@0.32.1
#RUN npm rebuild bcrypt --build-from-source
#RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]