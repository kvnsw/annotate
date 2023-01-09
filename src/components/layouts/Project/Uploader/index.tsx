import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Component } from 'react';
import axios from 'axios';
import { TFunction } from 'next-i18next';
import toast from 'react-hot-toast';
import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';

import {
  headerHeight,
  layoutTopBottomPadding,
} from '../../../../theme/variables';

interface UploaderProps {
  accountType: string;
  projectId: string;
  t: TFunction;
  ingestionCallback?: () => Promise<void>;
}

class Uploader extends Component<UploaderProps> {
  protected uppy: Uppy;

  constructor(props: UploaderProps) {
    super(props);

    this.uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        allowedFileTypes: ['audio/*'],
        maxNumberOfFiles: 500,
        maxFileSize: 1024 * 1024 * 50, // 50mb
      },
      locale: {
        strings: {
          dropPasteFiles: props.t('components:uploader.dropPasteFiles'),
        },
      },
      debug: true,
      allowMultipleUploadBatches: false,
    })
      .use(AwsS3, {
        limit: 4,
        getUploadParameters: async (file) => {
          // Errors throw here are handled by Uppy to display messages
          const res = await axios.post('/api/uploads', { key: file.meta.relativePath || `/${file.name}` }, {
            headers: {
              'x-auth': props.accountType,
            },
          });

          return {
            method: 'PUT',
            url: res.data,
          };
        },
      })
      .on('complete', async (result) => {
        // Launch audio sample creation
        // If ever this is not launched (network issues, user leaving page), no document will be
        // created but we may need to remove the file from S3. We could do this by adding an expiry
        // date to files on S3 upload and invalidating that expiry date on document creation.
        if (result.successful.length) {
          const filePaths = result.successful.map(file => new URL(file.uploadURL).pathname);

          try {
            await axios.post('/api/audio-samples/batch', { filePaths, projectId: props.projectId }, {
              headers: {
                'x-auth': props.accountType,
              },
            });

            if (props.ingestionCallback) {
              await props.ingestionCallback();
            }
          } catch (error: any) {
            if (error.isAxiosError) {
              toast(props.t(`common:errors.${error.response.status}`));
            } else {
              toast(props.t('common:errors.500'));
            }
          }
        }
      });
  }

  render() {
    const { t } = this.props;

    return (
      <Dashboard
        uppy={this.uppy}
        proudlyDisplayPoweredByUppy={false}
        doneButtonHandler={null as any}
        hideCancelButton
        width="100%"
        height={`calc(100vh - ${headerHeight} - calc(${layoutTopBottomPadding} * 2))`}
        note={t('components:uploader.note')}
      />
    );
  }
}

export default Uploader;
