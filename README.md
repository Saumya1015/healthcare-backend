# Healthcare Backend API

A RESTful Healthcare Backend API built using Node.js, Express.js, and PostgreSQL. The application provides secure user authentication, patient management, doctor management, and patient-doctor assignments.

## Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Patient CRUD operations
- Doctor CRUD operations
- Assign doctors to patients
- Retrieve patient-doctor mappings
- Remove doctor assignments
- Input validation and error handling
- PostgreSQL relational database

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt
- **Validation:** express-validator
- **API Testing:** Postman

## Prerequisites

- Node.js and npm
- PostgreSQL
- Postman (for API testing)

## Installation

1. Clone or download this repository.
2. Navigate to the project directory:

   ```bash
   cd healthcare-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a PostgreSQL database named `healthcare_db`.

5. Create a `.env` file in the project root and configure the following variables:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=healthcare_db
   DB_USER=postgres
   DB_PASSWORD=your_postgresql_password
   JWT_SECRET=your_private_jwt_secret
   ```

6. Create the required database tables: `users`, `patients`, `doctors`, and `patient_doctors`, using the project's database schema.

7. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:5000`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Patients

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/patients/` | Create a patient |
| GET | `/api/patients/` | Get the logged-in user's patients |
| GET | `/api/patients/:id` | Get a patient by ID |
| PUT | `/api/patients/:id` | Update a patient |
| DELETE | `/api/patients/:id` | Delete a patient |

### Doctors

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/doctors/` | Create a doctor |
| GET | `/api/doctors/` | Get all doctors |
| GET | `/api/doctors/:id` | Get a doctor by ID |
| PUT | `/api/doctors/:id` | Update a doctor |
| DELETE | `/api/doctors/:id` | Delete a doctor |

### Patient-Doctor Mappings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mappings/` | Assign a doctor to a patient |
| GET | `/api/mappings/` | Get mappings for the logged-in user's patients |
| GET | `/api/mappings/:patient_id` | Get doctors assigned to a patient |
| DELETE | `/api/mappings/:id` | Remove a doctor assignment |

## Authentication

For protected endpoints, log in through `/api/auth/login` and copy the returned JWT. In Postman, select **Authorization → Bearer Token** and paste the token.

## Security

- Passwords are hashed before storage.
- Protected routes require a valid JWT.
- Database credentials and JWT secrets should be stored in `.env`.
- Never commit `.env` or `node_modules` to Git.

## Database Relationships

- A user can create multiple patients.
- Each patient belongs to the user who created it.
- A patient can be assigned multiple doctors.
- A doctor can be assigned to multiple patients.
- Duplicate assignments for the same patient-doctor pair are prevented.

## Future Improvements

- Automated API tests
- API documentation with Swagger
- Deployment to a cloud hosting service
- Centralized error-handling middleware
