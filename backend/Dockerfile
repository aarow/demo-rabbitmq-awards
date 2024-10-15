# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Command to run the app using nodemon
CMD ["npm", "run", "dev"]

# what is the terminal command to rebuild docker image?
# docker image build -t backend .

# what is the terminal command to run docker image?
# docker run -p 5001:5001 backend