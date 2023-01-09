import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import dayjs from 'dayjs';
import { useAppSelector } from '../../../store/hooks';

import { AudioSampleDocument } from '../../../pages/api/audio-samples';
import { ProjectDocument } from '../../../pages/api/projects';

import Uploader from './Uploader';

import AudioSample from '../../elements/AudioSample';
import Player from '../../elements/Player';
import Project from '../../elements/Project';
import SimplePagination from '../../elements/SimplePagination';

import AudioSampleEdit from '../forms/AudioSampleEdit';
import ProjectAddEdit from '../forms/ProjectAddEdit';

import { GenericPageLayout, GenericTitle } from '../../../theme/global.styles';
import {
  AudioSampleColumn,
  AudioSampleFormWrapper,
  AudioSamplesHeadColumn,
  AudioSamplesHeadSection,
  AudioSamplesInnerHeadSection,
  AudioSamplesListing,
  AudioSamplesWrapper,
  ConfirmActionDesc,
  EditIcon,
  ProjectActions,
  ProjectInformations,
  ProjectWrapper,
  StatusButton,
  UploaderWrapper,
} from './styles';
import { Status } from '../../elements/AudioSample/styles';
import { DateDisplay } from '../../elements/Project/styles';

type ProjectStatus = ProjectDocument.Editable['status'] | undefined;

function ProjectLayout({
  data,
  isUpdating,
  update,
  samplesPage,
  setSamplesPage,
  isLoading,
  isLoadingSamples,
  isUpdatingSample,
  updateSample,
  samplesData,
  refreshAudioSamples,
}: {
  data: ProjectDocument.Populated,
  isUpdating: boolean,
  update: (_d: ProjectDocument.Editable) => Promise<void>,
  samplesPage: number,
  setSamplesPage: Function
  isLoading: boolean,
  isLoadingSamples: boolean,
  isUpdatingSample: boolean,
  updateSample: (_id: string, _d: AudioSampleDocument.Editable, _s?: boolean) => Promise<void>,
  samplesData: { count: number, data: AudioSampleDocument.Base[] } | undefined,
  refreshAudioSamples: () => Promise<void>,
}) {
  const { t } = useTranslation(['common', 'pages']);

  const { accountType } = useAppSelector(state => state.user.data!);
  const { current: currentAudioSample } = useAppSelector(state => state.player);

  const [updateModalOpened, setUpdateModalOpen] = useState(false);
  const [statusModalData, setStatusModalData] = useState<ProjectStatus>(undefined);
  const [uploadModalOpened, setUploadModalOpen] = useState(false);

  let nextStatus: ProjectStatus;

  switch (accountType) {
    case 'admin':
      switch (data.status) {
        case 'draft': {
          // We could go further adding rules but this
          // should be sufficient for now
          if (samplesData?.count) nextStatus = 'ongoing';
          break;
        }

        case 'review':
          nextStatus = 'completed';
          break;

        default:
          break;
      }
      break;

    case 'operator':
    default: {
      if (data.status === 'ongoing') nextStatus = 'review';
      break;
    }
  }

  const canUpload = data.status === 'draft'
    && accountType === 'admin'
    // We need to know if there are samples first
    // to prevent uploader blinking
    && !!samplesData;

  const showActions = accountType === 'admin' || !!nextStatus;

  return (
    <GenericPageLayout
      disablePadding
      isLoading={isUpdating || isLoading || isLoadingSamples || isUpdatingSample}
    >
      <ProjectWrapper>
        {showActions && (
          <ProjectActions>
            {accountType === 'admin' && (
              <EditIcon onClick={() => setUpdateModalOpen(true)} />
            )}
            {!!nextStatus && (
              <StatusButton
                size="sm"
                onClick={() => setStatusModalData(nextStatus!)}
              >
                {t(`pages:project.statusAction.${nextStatus}`)}
              </StatusButton>
            )}
          </ProjectActions>
        )}
        <ProjectInformations withActions={showActions}>
          <Project variant="display" data={data} />
        </ProjectInformations>
      </ProjectWrapper>

      <AudioSamplesWrapper fullSize={!currentAudioSample}>
        {!!samplesData?.count && (
          <AudioSamplesHeadSection fullSize={!currentAudioSample}>
            <AudioSamplesInnerHeadSection>
              <GenericTitle>
                {t('pages:project.title', { count: samplesData?.count || 0 })}
              </GenericTitle>
              {canUpload && !!samplesData?.count && (
                <Button type="button" onClick={() => setUploadModalOpen(true)}>
                  {t('pages:project.uploadSamples')}
                </Button>
              )}
            </AudioSamplesInnerHeadSection>
            <AudioSamplesHeadColumn>
              <AudioSampleColumn />
              <AudioSampleColumn>
                {t('pages:project.audioSamples.title')}
              </AudioSampleColumn>
              <AudioSampleColumn>
                {t('pages:project.audioSamples.submittedAt')}
              </AudioSampleColumn>
              <AudioSampleColumn>
                {t('pages:project.audioSamples.reviewedAt')}
              </AudioSampleColumn>
              <AudioSampleColumn>
                {t('pages:project.audioSamples.skipped')}
              </AudioSampleColumn>
              <AudioSampleColumn>
                {t('pages:project.audioSamples.status')}
              </AudioSampleColumn>
            </AudioSamplesHeadColumn>
          </AudioSamplesHeadSection>
        )}
        {canUpload && !samplesData?.count && (
          <UploaderWrapper>
            <Uploader
              accountType={accountType}
              projectId={data._id}
              t={t}
              ingestionCallback={refreshAudioSamples}
            />
          </UploaderWrapper>
        )}
        {!!samplesData?.data.length && (
          <AudioSamplesListing>
            {samplesData.data.map(audioSample => (
              <AudioSample key={audioSample._id} data={audioSample} />
            ))}
          </AudioSamplesListing>
        )}
        <SimplePagination
          nbPages={Math.ceil((samplesData?.count || 0) / 20)}
          currentPage={samplesPage}
          setPage={setSamplesPage}
        />
      </AudioSamplesWrapper>

      {!!currentAudioSample && (
        <AudioSampleFormWrapper>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <DateDisplay>
              {t('common:updatedAt')}
              &nbsp;
              {dayjs(currentAudioSample.updatedAt).format('L - HH:mm')}
            </DateDisplay>
            <Status status={currentAudioSample.status}>
              {t(`common:audioSampleStatus.${currentAudioSample.status}`)}
            </Status>
          </div>
          <Player />
          <AudioSampleEdit
            key={currentAudioSample._id}
            data={currentAudioSample}
            isSubmitting={isUpdatingSample}
            onSubmit={updateSample}
          />
        </AudioSampleFormWrapper>
      )}

      <ProjectAddEdit
        show={updateModalOpened}
        onHide={() => setUpdateModalOpen(false)}
        data={data}
        isSubmitting={isUpdating}
        onSubmit={update}
      />
      {canUpload && !!samplesData?.count && (
        <Modal
          show={!!uploadModalOpened}
          onHide={() => setUploadModalOpen(false)}
          centered
          size="lg"
        >
          <Uploader
            accountType={accountType}
            projectId={data._id}
            t={t}
            ingestionCallback={async () => {
              setUploadModalOpen(false);
              await refreshAudioSamples();
            }}
          />
        </Modal>
      )}
      <Modal
        show={!!statusModalData}
        onHide={() => setStatusModalData(undefined)}
        centered
      >
        <ConfirmActionDesc>
          {t('pages:project.confirmStatusChange')}
        </ConfirmActionDesc>
        <Button
          onClick={async () => {
            await update({ status: statusModalData! });
            setStatusModalData(undefined);
          }}
          className="mx-auto mt-4"
        >
          {t('common:form.submit')}
        </Button>
      </Modal>
    </GenericPageLayout>
  );
}

export default ProjectLayout;
