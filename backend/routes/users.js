const  {updateThisUser,getUsers,getUserById, updateUser, loginUser, registerUser,postCodeTest} = require('../controllers/userControllers');
const fileUpload = require('../lib/fileUpload');

//Import express router 
const router = require('express').Router();

//GET endpoints
router.get('/',getUsers);
router.get('/:UserId',getUserById);

//POST endpoints
router.post('/login', loginUser);
router.post('/register',fileUpload("./storage/images"), registerUser);
//router.post('postcode'.postCodeTest)

router.put('/editProfile', fileUpload("./storage/images"), updateThisUser);

module.exports = router;