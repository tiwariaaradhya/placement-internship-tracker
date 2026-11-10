# Placement & Internship Tracker

A web-based Placement and Internship Management System designed to help students track placement opportunities, internships, companies, and job applications in one place.

## About the Project

Placement & Internship Tracker is a full-stack web application developed to simplify the placement preparation and application tracking process for students.

The system provides a centralized dashboard to manage student information, company details, internship opportunities, and application records.

## Features

- **Dashboard:** Overview of placement and internship activities.
- **Student Management:** Manage student records.
- **Company Management:** Maintain company information.
- **Internship Management:** Add and manage internship opportunities.
- **Application Tracking:** Track student applications.
- **REST APIs:** Backend APIs built using Spring Boot.

## Tech Stack

| Technology | Purpose |
|---|---|
| Java | Backend Programming |
| Spring Boot | Backend Framework |
| Spring Data JPA | Data Access |
| MySQL | Database |
| HTML5 | Frontend Structure |
| CSS3 | Styling |
| JavaScript | Frontend Functionality |
| Maven | Build Management |
| Git & GitHub | Version Control |

## Project Structure

```text
placement_tracker/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.css
│   ├── dashboaard.js
│   └── pages/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/placement/placement_tracker/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── model/
│       │       └── PlacementTrackerApplication.java
│       │
│       └── resources/
│           ├── application.properties
│           └── static/
│
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Java JDK
- Maven
- MySQL Server
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/tiwariaaradhya/placement-internship-tracker.git
```

**2. Navigate to the project directory**

```bash
cd placement-internship-tracker
```

**3. Configure the database**

Create a MySQL database and configure your database URL, username, and password in:

```text
src/main/resources/application.properties
```

Use your own local database credentials. Do not commit passwords or other secrets to GitHub.

**4. Run the application**

```bash
mvn spring-boot:run
```

**5. Open in browser**

```text
http://localhost:8080
```

## Learning Outcomes

Through this project, I am gaining practical experience in:

- Java and Object-Oriented Programming.
- Spring Boot application development.
- REST API development.
- Database integration using MySQL.
- Frontend and backend integration.
- Git and GitHub version control.

## Future Improvements

- User authentication and authorization.
- Resume upload functionality.
- Email notifications.
- Advanced placement analytics.
- Application status notifications.

## Author

**Aaradhya Tiwari**

- GitHub: [@tiwariaaradhya](https://github.com/tiwariaaradhya)

---

*Built as a learning project to explore full-stack Java development.*
