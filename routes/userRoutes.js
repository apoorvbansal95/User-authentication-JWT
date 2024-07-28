import express from 'express'
const router =express.Router()
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/auth-middleware.js'


//Route level middleware - to protect route

router.use('/changepassword', checkUserAuth )
router.use('/loggeduser', checkUserAuth)
// Public route

router.post('/register', UserController.userRegistration)

router.post('/login', UserController.userLogin )

router.post('/send-reset-password-email', UserController.sendUSerPasswordResetEmail)

router.post('/reset-password/:id/:token', UserController.userPasswordReset)

//protected route
router.post('/changepassword', UserController.changeUSerPassword)
router.get('/loggeduser', UserController.loggedUser)

export default router