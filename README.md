## Project Setup

This project consists of a **backend** powered by Django and a **frontend** powered by React. Follow the steps below to set up and run the project.

---

### Backend Setup

1. **Install Dependencies**:
   ```bash
   pipenv install
   ```

2. **Activate the Virtual Environment**:
   ```bash
   pipenv shell
   ```

3. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

4. **Run the Django Server**:
   ```bash
   python manage.py runserver
   ```

   - The Django backend will be running at **http://127.0.0.1:3000**

5. **Run Server with Test Database (Optional)**:
   ```bash
   python manage.py runserver --settings=backend.test_settings
   ```

---

### Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

   - The React frontend will be running at **http://127.0.0.1:5173**

---

### API Testing with Newman (Postman CLI)

To run Postman tests using Newman:

```bash
newman run EMFStest.json -e local_env.json
```

- `EMFStest.json`: Postman collection file 
- `local_env.json`: Postman environment file with variables (e.g., base URL, tokens)

---

### Notes

- Ensure both the backend and frontend servers are running simultaneously for full functionality.
- If you encounter any issues, check that all dependencies are installed correctly and the correct ports are used.
- Use the test settings configuration to run the server with a separate test database during automated testing.
