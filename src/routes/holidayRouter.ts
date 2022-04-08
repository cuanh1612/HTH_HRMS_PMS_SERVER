import express from 'express'
import holidayController from '../controllers/holidayController'


const holidayRouter = express.Router()

holidayRouter.post('/', holidayController.create)


holidayRouter.put('/:id', holidayController.update)

holidayRouter.get('/', holidayController.getAll)
holidayRouter.get('/:id', holidayController.getDetail)

holidayRouter.delete('/:id', holidayController.delete)
holidayRouter.delete('/delete-many', holidayController.deletemany)

export default holidayRouter