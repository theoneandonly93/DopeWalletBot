# Use official Node.js image as base
FROM node:20-bullseye

# Install Python 3
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspaces/DopeWalletBot

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy rest of the app
COPY . .

# Expose port (adjust as needed)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
