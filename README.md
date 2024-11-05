# Files Manager

![Back-end](https://img.shields.io/badge/Back--end-Node.js-informational?style=flat&logo=node.js&color=339933)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat&logo=javascript)
![NoSQL](https://img.shields.io/badge/Database-NoSQL-informational?style=flat&logo=mongodb&color=47A248)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat&logo=mongodb&color=47A248)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=flat&logo=redis&color=DC382D)
![NodeJS](https://img.shields.io/badge/Node.js-JavaScript_runtime-339933?style=flat&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-Framework-lightgrey?style=flat&logo=express)
![Kue](https://img.shields.io/badge/Kue-Job_Queue-blue?style=flat&logo=javascript)



A robust back-end file management API built with Node.js, Express, MongoDB, Redis, Bull and Mocha that handles user authentication, file upload/view/change permission, thumbnail generation and background processing.

## 🚀 Features

- **User Authentication**: Secure token-based authentication system
- **File Operations**: Upload, download, publish/unpublish, and list files
- **Image Processing**: Automatic thumbnail generation for uploaded images
- **Background Jobs**: Efficient processing using Bull queues
- **Data Storage**: MongoDB for file metadata and Redis for caching
- **Security**: SHA1 password hashing and token-based access control

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**: 
  - MongoDB (file metadata)
  - Redis (caching & authentication)
- **Image Processing**: image-thumbnail
- **Queue System**: Bull
- **Testing**: Jest

## 📋 Prerequisites

- JavaScript
- Node.js 12.x
- Express.js
- MongoDB
- Redis

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/james-eo/alx-files_manager.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables: cd into alx-files_manager(root) directory and create `.env` file. Copy the following environment variables into the `.env` file
   ```bash
    PORT=5000
    DB_HOST=localhost
    DB_PORT=27017
    DB_DATABASE=files_manager
    FOLDER_PATH=/tmp/files_manager

   ```

4. Start the servers:
   ```bash
   npm run start-server    # Start API server
   npm run start-worker    # Start background worker
   ```

## 🔑 API Endpoints

### Authentication
- `POST /users` - Create new user
- `GET /connect` - Sign-in user
- `GET /disconnect` - Sign-out user
- `GET /users/me` - Get user profile

### File Operations
- `POST /files` - Upload new file
- `GET /files/:id` - Get file by ID
- `GET /files` - List all files
- `PUT /files/:id/publish` - Publish file
- `PUT /files/:id/unpublish` - Unpublish file
- `GET /files/:id/data` - Get file content

## 🧪 Testing

Run the test suite:

```bash
npm test
```


## 👥 Authors/Contrbution

1. James Okonkwo
2. Taf Muzira

## ✨ Acknowledgments

- ALX Africa Software Engineering Program
- All contributors and reviewers

---

⭐ Star this repository if you find it helpful!
