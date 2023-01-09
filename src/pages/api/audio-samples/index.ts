import { IAudioSample } from '../../../models/AudioSample.model';

export namespace AudioSampleDocument {
  export type Base = Pick<IAudioSample, 'title' | 'sampleUrl' | 'status' | 'skipped' | 'annotations'> & {
    _id: string, // ObjectId
    projectId: string, // ObjectId
    submittedAt?: string, // ISO String date
    reviewedAt?: string, // ISO String date
    createdAt: string, // ISO String date
    updatedAt: string, // ISO String date
  }

  export interface Populated extends Base {}

  export type Editable = Pick<IAudioSample, 'skipped' | 'status' | 'annotations'>;
}
