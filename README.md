## How to Use the Project

### 1. Prerequisites
Install Node.js, PostgreSQL, and Postman.

### 2. Clone the Repository
```bash
git clone https://github.com/Saumya1015/healthcare-backend.git
cd healthcare-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure the Environment
Create a `.env` file in the project root and add your PostgreSQL credentials, database name (`healthcare_db`), port (`5000`), and a secure JWT secret.

### 5. Set Up the Database
Create the `healthcare_db` database in PostgreSQL and create the required tables: `users`, `patients`, `doctors`, and `patient_doctors`, using the project's database schema.

### 6. Start the Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 7. Test the API Using Postman

Use `http://localhost:5000` as the base URL.

- **Register:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Create a patient:** `POST /api/patients/`
- **View patients:** `GET /api/patients/`
- **Create a doctor:** `POST /api/doctors/`
- **View doctors:** `GET /api/doctors/`
- **Assign a doctor:** `POST /api/mappings/`
- **View assigned doctors:** `GET /api/mappings/:patient_id`
- **Remove an assignment:** `DELETE /api/mappings/:id`

For registration and login, select **Body → raw → JSON** in Postman and provide the required fields. After logging in, copy the JWT token and select **Authorization → Bearer Token** for protected endpoints.

Use the appropriate HTTP method and endpoint for updating or deleting patient and doctor records.

**Note:** This project runs locally and does not require deployment. Keep the server running while testing the APIs. Never upload your `.env` file or share your database password or JWT secret.
