FROM node:18-alpine

# copy the directory into the container
RUN mkdir -p /site/express-node
COPY . /site/express-node

# install the dependencies
# workdir is required so that npm install to the right place
WORKDIR /site/express-node
RUN npm install && npm run build

# start the application
CMD npm run start
