# Create image based on the official Node 8 image from the dockerhub
FROM node:8

# # # # # # # # # # # # # # PART I: SERVER BUILD # # # # # # # # # # # # # # # # # 
# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .
# # # # # # # # # # # # # # PART I: SERVER BUILD # # # # # # # # # # # # # # # # # 

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app/

# Expose the port the app runs in
EXPOSE 5000

# Serve the app
CMD ["npm", "start"]