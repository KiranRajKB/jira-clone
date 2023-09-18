# Use an official Golang runtime as the base image
FROM golang:1.21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the Go module and Go sum files
COPY go.mod go.sum ./

# Download and install any Go modules
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port the app runs on
EXPOSE 8081

# Start the Go application
CMD ["./main"]
