

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   git clone https://github.com/badalhalder99/rest-api-node.git
   ```

2. ** Go to the root directory:

**Terminal 1 - Backend Server:**
```bash
cd backend
```
```bash
yarn
yarn start
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
```
```bash
yarn
yarn start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get user by ID |

### Example API Usage

**Get all users:**
```bash
curl http://localhost:3002/api/users
```


**Get user by ID:**
```bash
curl http://localhost:3002/api/users/1
```


### Common Issues

**Port already in use:**
- Backend: Change `PORT` in `backend/server.js`
- Frontend: Set `PORT=3002` environment variable before starting

**CORS errors:**
- Ensure backend server is running
- Check that API_BASE_URL in frontend matches backend URL
- The backend now includes proper CORS headers for all endpoints

**Dependencies not found:**
- Run `yarn install` in the root directory
- Ensure you're using Yarn, not npm

**"Error connecting to server: Failed to fetch":**
- Make sure the backend server is running on port 3001
- Check that both frontend and backend are started
- Verify the API_BASE_URL in frontend/src/App.js is correct

