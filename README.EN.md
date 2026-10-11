# UrbanFeet-Frontend

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 
---

**¿Quieres leerlo en español?** Clic >>[here](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/main/README.md)<<

Web application built with **Angular**. This repository contains the frontend source code developed as part of the "Integrative Web Project" course at **UTP** The system simulates digital management for the fictitious company **Urban Feet**.

### 🛠️ Full Stack Architecture
This project works in conjunction with a separately developed REST API.
* **Frontend (This repo):** Angular, TypeScript, Tailwind CSS.
* **Backend:** Spring Boot, JWT in cookies, Spring Security, ... -> **[View Backend Repository](https://github.com/Renzito0637d/UrbanFeet-Backend)**

## 📦 Key Features

### 🛒 Client Module (Public)

- **Interactive Catalog:** Advanced server-side filtering (Brand, Gender, Type, Size, Price) without losing pagination state.
- **Shopping Cart:** Local state management, stock validation, and real-time total calculation.
- **Simulated Payment Gateway:** Reactive form to process payments with conditional validations (Credit Card vs Digital Wallets like Yape/Plin).
- **Complaints Book:** Integrated digital form with session validation for data auto-completion.
- **Dark/Light Mode:** Native support using Tailwind CSS.

### 🛡️ Administrative Module (Private)

- **Analytical Dashboard:**
    - Real-time KPIs (Sales, Users, Orders).
    - Dynamically generated SVG charts.
    - Top selling products and recent orders tables.
- **User Management:** Paginated tables for Customers and Administrators.
- **Reports:** Data export of Sales and Users to **PDF** and **Excel** directly from the backend.
- **Complaints Management:** Inbox to handle complaints and change statuses (Pending, Resolved).

## 🛠️ Technologies

- **Framework:** Angular 17+ (Standalone Components, Signals, inject()).
- **Styles:** Tailwind CSS.
- **UI Components:** Angular Material (Dialogs, Icons).
- **Notifications:** Ngx-Sonner.
- **Http Client:** REST integration with Spring Boot.

## 🚀 Installation and Setup

1. **Clone the repository:**
    ```
    git clone https://github.com/Renzito0637d/UrbanFeet-Frontend.git
    ```

2. **Enter the project directory:**
    ```
    cd UrbanFeet-Frontend
    ```

3. **Install dependencies:**
    ```
    npm install
    ```

4. **Run the development server:**
    ```
    ng serve --open
    ```

### Project Theme Selection

|Light Mode|Dark Mode|
|---|---|
|![Light Mode](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-14%2020-14-05.webp?raw=true)|![Dark Mode](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-14%2020-14-20.webp?raw=true)|

## Project Gallery

### > Home

![Home](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-14%2020-16-06.webp?raw=true)

### > Catalog with pagination + filtering

![Catalog](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-14%2020-16-24.webp?raw=true)

### > Login

![Login](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-14%2020-17-31.webp?raw=true)

### > Admin Dashboard

![Admin Dashboard](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-15%2013-48-08.webp?raw=true)

### > Admin: Sneaker management and variations with pagination

![Admin Sneakers](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/img-opti/Images/Captura%20de%20pantalla%20de%202025-12-15%2013-48-33.webp?raw=true)

### [> View More](https://github.com/Renzito0637d/UrbanFeet-Frontend/blob/main/Gallery.md)