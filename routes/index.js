import express from "express"; 

const router = express.Router();
import userController from '../controllers/userController'
import loginController from '../controllers/auth/loginController'
router.post('/login', loginController.login);
router.post("/insert" ,userController.register);
router.get('/image', userController.getimage);
router.put('/updates/:id',userController.update);
router.delete('/delete/:id', userController.delete);
router.get('/details', userController.details);
router.get('/details/:id', userController.detail);


export default router ;