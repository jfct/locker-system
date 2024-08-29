FROM node:20

# Set working directory
WORKDIR /app

# Copy package
COPY package*.json ./

# Run clean install
RUN npm ci

# Copy files
COPY . .

CMD npm run migration:up && npm start
