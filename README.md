# Web Auction

A *full-stack* web application for managing online auctions. This platform allows users to buy and sell through auctions, with real-time updates.

## 🚀 Features

* **Authentication and Authorization:** Secure registration and login using JWT (JSON Web Tokens).
* **Real-Time Auctions:** Live auction updates using WebSockets (STOMP).
* **Auction Management:** Creation, updating, and viewing of auctions with support for image uploads.
* **Feedback System:** Users can leave reviews about transactions.

## 🛠️ Technologies Used

### Backend
* **Language:** Java 17+
* **Framework:** Spring Boot
* **Security:** Spring Security & JWT
* **Database:** Spring Data JPA (MySQL)
* **Communication:** WebSocket & REST API
* **Build Tool:** Maven

### Frontend
* **Library:** React.js
* **Routing:** React Router
* **Styles:** CSS3
* **Package Manager:** NPM

## 🏁 Getting Started

Follow the instructions below to set up the project in your local environment.

### Prerequisites
* **Java:** JDK 17 or higher
* **Node.js:** v14 or higher
* **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/web-auction.git](https://github.com/your-username/web-auction.git)
    cd web-auction
    ```

2.  **Backend Setup**
    Navigate to the backend folder and start the server:
    ```bash
    cd backend
    # Configure your database settings in src/main/resources/application.properties
    ./mvnw spring-boot:run
    ```
    *The backend server will typically start on `http://localhost:8080`.*

3.  **Frontend Setup**
    Open a new terminal, navigate to the frontend folder, install dependencies, and start the app:
    ```bash
    cd frontend
    npm install
    npm start
    ```
    *The frontend application will run on `http://localhost:3000`.*

## ⚙️ Configuration

* **Database:** Provide your database credentials (URL, username, password) in `backend/src/main/resources/application.properties`.
* **Secrets:** For security configurations (like JWT keys), refer to `application-secrets(example).properties` to create your own configuration file.

## 🤝 Special Thanks

I'd like to give my special thanks to Frank Willian, my teacher who proposed this annual challenge to the class, which provided me with a great deal of knowledge (especially about websockets, something I had never implemented before).
