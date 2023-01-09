import { Document, model, models, ObjectId, Schema } from 'mongoose';

export interface IAudioSample extends Document {
  title: string;
  projectId: ObjectId;
  sampleUrl: string;
  status: 'ongoing' | 'review' | 'accepted' | 'rejected';
  skipped?: boolean;
  annotations?: {
    wake?: {
      start?: number;
      end?: number;
    };
    utterance?: {
      transcript?: string;
      start?: number;
      end?: number;
    };
  };
  submittedAt?: Date;
  reviewedAt?: Date;
}

const schema = new Schema<IAudioSample>({
  title: {
    type: String,
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'project',
    required: true,
  },
  sampleUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ongoing', 'review', 'accepted', 'rejected'],
    required: true,
    default: 'ongoing',
  },
  skipped: Boolean,
  annotations: {
    wake: {
      start: Number,
      end: Number,
    },
    utterance: {
      transcript: String,
      start: Number,
      end: Number,
    },
  },
  submittedAt: Date,
  reviewedAt: Date,
}, { timestamps: true });

// GET /projects/[id]/audio-samples
schema.index({ projectId: 1, createdAt: -1 });
// GET /projects (aggregate)
schema.index({ status: 1 });

export default models.audio_sample || model<IAudioSample>('audio_sample', schema);
