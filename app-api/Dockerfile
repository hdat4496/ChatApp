FROM node:8.12.0

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

EXPOSE 10010


# Install all dependencies of the current project.
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Copy all local files into the image.
COPY api api
COPY config config
COPY test test
COPY app.js app.js

# Run service
CMD npm start