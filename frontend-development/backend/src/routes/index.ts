import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Task Tracker API Root' });
});

export default router; 