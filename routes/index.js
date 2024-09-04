import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const express = require('express');

const route = express.Router();

route.get('/status', AppController.getStatus);
route.get('/stats', AppController.getStats);

route.post('/users', UsersController.postNew);
route.get('/users/me', UsersController.getMe);

route.get('/connect', AuthController.getConnect);
route.get('/disconnect', AuthController.getDisconnect);

route.post('/files', FilesController.postUpload);

export default route;
