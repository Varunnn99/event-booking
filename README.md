# Event Management System

## Overview
This is a full-stack event management system where users can browse events, add them to their cart, and generate tickets upon checkout. The system includes user authentication, a cart system, and a backend API.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **State Management:** Redux

## Features
- **User Authentication** (Login/Register with JWT)
- **Event Listing and Details**
- **Cart System** (Add/Remove Events) using Redux
- **Checkout System** (No payment integration, clicking "Pay Now" generates a ticket)
- **Orders Stored in MySQL** (`orders` table stores ticket details)
- **Environment Variables Configuration**

## Database Schema
The database is defined in MySQL. The tables used are:

### `users` Table
```sql
desc users;
```
| Field    | Type         | Null | Key | Default | Extra          |
|----------|--------------|------|-----|---------|----------------|
| id       | int          | NO   | PRI | NULL    | auto_increment |
| email    | varchar(255) | NO   | UNI | NULL    |                |
| password | varchar(255) | NO   |     | NULL    |                |
| name     | varchar(255) | NO   |     | NULL    |                |

### `events` Table
```sql
desc events;
```
| Field       | Type          | Null | Key | Default | Extra          |
|-------------|--------------|------|-----|---------|----------------|
| id          | int          | NO   | PRI | NULL    | auto_increment |
| heading     | varchar(255) | NO   |     | NULL    |                |
| year        | int          | NO   |     | NULL    |                |
| month       | varchar(20)  | NO   |     | NULL    |                |
| location    | varchar(255) | NO   |     | NULL    |                |
| description | text         | NO   |     | NULL    |                |
| img         | varchar(500) | NO   |     | NULL    |                |
| price       | decimal(10,2)| NO   |     | 0.00    |                |

### `orders` Table
```sql
desc orders;
```
| Field         | Type         | Null | Key | Default           | Extra             |
|---------------|--------------|------|-----|-------------------|-------------------|
| id            | int          | NO   | PRI | NULL              | auto_increment    |
| user_id       | int          | NO   | MUL | NULL              |                   |
| event_id      | int          | NO   | MUL | NULL              |                   |
| ticket_id     | varchar(255) | NO   | UNI | NULL              |                   |
| purchase_date | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

## Environment Variables
The `.env` file should contain:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking
JWT_SECRET=d0ef47f671584ffb40b472ce5a264f90cc893b0fba6fe219b926533c11fac0a19162284eac6960b2e2c0b242b6da14916baacb4aad02317f62aab82849066d7f
```

## Setup Instructions
### 1. Clone the repository
```sh
git clone https://github.com/your-username/event-management-system.git
cd event-management-system
```

### 2. Install Dependencies
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd frontend
npm install
```

### 3. Configure Database
- Import the `database_schema.sql` file into MySQL.
- Alternatively, create tables manually using the schema provided above.

### 4. Run the Server
```sh
cd backend
node server.js
```

### 5. Run the Frontend
```sh
cd frontend
npm start
```

## How to Use
1. Register/Login to your account.
2. Browse events and add them to your cart.
3. Proceed to checkout.
4. Click "Pay Now" (No actual payment, tickets are generated and stored in MySQL `orders` table).
5. View purchased tickets in "My Events".

## Screenshots
(You can add screenshots here)

## Future Enhancements
- Add actual payment integration.
- Improve UI/UX.
- Deploy the application.


