# Use a lightweight Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]

