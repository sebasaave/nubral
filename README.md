# nubral
A cloud backend for Neural Radiance Fields reconstructions.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

Follow these steps to clone and run the project.

### 1. Clone the Repository

```bash
git clone https://github.com/sebasaave/nubral.git
cd nubral
```

### 2. Run the Project

Build and start all services (backend, frontend, and database) using Docker Compose:

```bash
docker-compose up --build
```

### 3. Access the Services

- **Frontend (Vue App):** [http://localhost:5173](http://localhost:5173)
- **Backend (Django API):** [http://localhost:8000](http://localhost:8000)

## Stopping the Project

To stop all running containers:

```bash
docker-compose down
```

## Troubleshooting

- Ensure Docker and Docker Compose are installed and running.
- Check for port conflicts on `5173` (frontend) or `8000` (backend).
- If containers fail to start, review logs using:

```bash
docker-compose logs
```
