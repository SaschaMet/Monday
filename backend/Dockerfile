# Use the official Python 3.12 image as the base image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory to the working directory
COPY app .

# Load the environment variables from the .env file
COPY .env .
ENV GOOGLE_APPLICATION_CREDENTIALS=gcloud-credentials.json

# Expose the port on which the server will listen
EXPOSE 2122

# Run the server using Uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "2122"]


# docker build -t monday-backend . && docker rm -f monday-backend-server && docker run -d --name monday-backend-server -p 2122:2122 monday-backend