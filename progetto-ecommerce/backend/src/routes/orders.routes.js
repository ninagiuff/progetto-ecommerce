const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/orders.controller');
const auth       = require('../middleware/auth.middleware');

// Pubblica: crea ordine dal checkout
router.post('/', controller.createOrder);

// Protette (solo admin)
router.get('/',    auth, controller.getAll);
router.get('/:id', auth, controller.getById);

module.exports = router;
