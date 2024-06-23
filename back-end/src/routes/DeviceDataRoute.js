const router = require('express').Router();
const DeviceDataController = require('../controllers/DeviceDataController');

router.get('/', DeviceDataController.getAllData);
router.get('/id/:id', DeviceDataController.getDataById);
router.post('/', DeviceDataController.addData);
router.get('/newest', DeviceDataController.getAllDevicesNewestData);
router.post('/add-many',DeviceDataController.addManyData)
router.get('/historic/id/:id',DeviceDataController.historicHourly)
router.get('/newest/id/:id',DeviceDataController.getDeviceNewestData)

module.exports = router;