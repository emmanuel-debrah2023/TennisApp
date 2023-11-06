const  {updateThisUser,getUsers,getUserById, updateUser, loginUser, registerUser} = require('../controllers/userControllers');

//Import express router 
const router = require('express').Router();

//GET endpoints
router.get('/',getUsers);
router.get('/:UserId',getUserById);

//POST endpoints
router.post('/login', loginUser);
router.post('/register', registerUser);

router.put('/editProfile', updateThisUser);

module.exports = router;