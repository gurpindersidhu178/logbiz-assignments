import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Task, { Priority, Status, ISubtask } from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Active', 'Completed', 'Archived']).withMessage('Status must be Active, Completed, or Archived')
];

// GET /api/tasks?status=Active&priority=High&archived=false
router.get('/', requireAuth, [
  query('status').optional().isIn(['Active', 'Completed', 'Archived']),
  query('priority').optional().isIn(['Low', 'Medium', 'High']),
  query('archived').optional().isBoolean()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { status, priority, archived } = req.query;
    const filter: any = { userId: req.user!.id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (archived !== undefined) filter.archived = archived === 'true';

    const tasks = await Task.find(filter)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('userId', 'email');

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
router.post('/', requireAuth, validateTask, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, dueDate, priority, subtasks } = req.body;
    
    const task = new Task({
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      status: 'Active',
      archived: false,
      subtasks: subtasks || [],
      userId: req.user!.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', requireAuth, validateTask, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const update = req.body;
    
    // Ensure dueDate is properly formatted
    if (update.dueDate) {
      update.dueDate = new Date(update.dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      update,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id/archive
router.patch('/:id/archive', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { archived } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { archived: !!archived },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error('Error archiving task:', err);
    res.status(500).json({ error: 'Failed to archive task' });
  }
});

// PATCH /api/tasks/:id/subtasks
router.patch('/:id/subtasks', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subtasks } = req.body;

    if (!Array.isArray(subtasks)) {
      res.status(400).json({ error: 'Subtasks must be an array' });
      return;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { subtasks },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error('Error updating subtasks:', err);
    res.status(500).json({ error: 'Failed to update subtasks' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user!.id });
    
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 