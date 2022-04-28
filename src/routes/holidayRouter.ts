import express from 'express'
import holidayController from '../controllers/holidayController'
import { checkAuth } from '../utils/middleware/checkAuth'


const holidayRouter = express.Router()

holidayRouter.post('/', checkAuth(['Admin']), holidayController.create)


holidayRouter.put('/:id', checkAuth(['Admin']), holidayController.update)

holidayRouter.get('/', holidayController.getAll)
holidayRouter.get('/:id', holidayController.getDetail)

holidayRouter.delete('/:id', checkAuth(['Admin']), holidayController.delete)
holidayRouter.delete('/delete-many', checkAuth(['Admin']), holidayController.deletemany)

export default holidayRouter