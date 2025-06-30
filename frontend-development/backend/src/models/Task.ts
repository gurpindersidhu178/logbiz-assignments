import mongoose, { Document, Schema } from 'mongoose';

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Active' | 'Completed' | 'Archived';

export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  archived: boolean;
  subtasks: ISubtask[];
  userId: mongoose.Types.ObjectId;
}

const SubtaskSchema = new Schema<ISubtask>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: false });

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
  archived: { type: Boolean, default: false },
  subtasks: [SubtaskSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Index for better query performance
TaskSchema.index({ userId: 1, status: 1, priority: 1 });
TaskSchema.index({ dueDate: 1 });

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task; 