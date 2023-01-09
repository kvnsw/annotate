import { Document, model, models, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  provider?: string;
  status: 'draft' | 'ongoing' | 'review' | 'completed';
  dueDate?: Date;
  completedDate?: Date;
  createdAt: Date,
  updatedAt: Date,
}

const schema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
  },
  provider: String,
  status: {
    type: String,
    enum: ['draft', 'ongoing', 'review', 'completed'],
    default: 'draft',
    required: true,
  },
  dueDate: Date,
  completedDate: Date,
}, { timestamps: true });

// GET /projects (countDocuments by status & aggregate sort with match)
schema.index({ status: 1, updatedAt: -1 });
// GET /projects (aggregate sort without match)
schema.index({ updatedAt: -1 });

export default models.project || model<IProject>('project', schema);
