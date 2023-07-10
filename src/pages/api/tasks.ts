import dbConnect from '../../db/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Task from '../../models/Task'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  console.log('req.query', req.query)
  await dbConnect()

  switch (method) {
    case 'GET':
      if (req.query.id) {
        try {
          const Tasks = await Task.find({id: req.query.id})
          res.status(200).json({ success: true, data: Tasks })
        } catch (e) {
          res.status(400).json({ success: false })
        }
      } else {
        try {
          const Tasks = await Task.find({})
          res.status(200).json({ success: true, data: Tasks })
        } catch (error) {
          res.status(400).json({ success: false })
        }
      }
      break
    case 'POST':
      try {
        const task = await Task.create(req.body)
        res.status(201).json({ success: true, data: task })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PATCH':
      try {
        const task = await Task.findByIdAndUpdate(req.query.id, req.body)
        res.status(201).json({ success: true, data: task })
      } catch (e) {
        res.status(400).json({ success: false, error: e })
      }
      break
    case 'DELETE':
      try {
        const task = await Task.findByIdAndDelete(req.query.id)
        res.status(204).json({success: true, data: task})
      } catch (e) {
        res.status(400).json({ success: false, error: e})
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
