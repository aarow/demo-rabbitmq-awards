# Use the official Node.js image.
FROM node:20

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Check the NODE_ENV variable and run the appropriate command
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run build && npm start; else npm run dev; fi"]