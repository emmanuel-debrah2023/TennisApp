const  {addNewUser,getUsers,getUserById, updateUser, loginUser, registerUser} = require('../controllers/userControllers');

//Import express router 
const router = require('express').Router();

//GET endpoints
router.get('/',getUsers);
router.get('/:UserId',getUserById);

//POST endpoints
router.post('/login', loginUser);
router.post('/register', registerUser);

//PATCH PATCH endpoints 
//router.put('/profile',updateUser)

//DELETE endpoints
//





module.exports = router;