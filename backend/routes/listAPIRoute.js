const express = require('express');
const router = express.Router();
const listController = require('../controllers/listAPI');
const { menu } = require('../middleware/auth');

router.post('/list', menu, listController.addList);
router.put('/list/:id', listController.updateList);
router.delete('/list/:id', listController.deleteList);
router.get('/list', menu, listController.getList);
router.put('/statutList/:id', listController.updateStatutById);
router.put('/lists/:id', listController.updateListContenu);
router.get('/searchList/:searchTerm', menu, listController.searchList);

module.exports = router;
