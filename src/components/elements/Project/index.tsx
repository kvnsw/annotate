import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ReactElement } from 'react';
import { OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap';

import { ProjectDocument } from '../../../pages/api/projects';

import {
  AnnotationProgressWrapper,
  DateDisplay,
  DateWrapper,
  DisplayWrapper,
  HeadSection,
  IconTextWrapper,
  PreHeadSection,
  ProgressPlaceholder,
  ProgressWrapper,
  Provider,
  RejectedReviews,
  Status,
  StyledAudioIcon,
  StyledCheckIcon,
  StyledSkipIcon,
  StyledTimeIcon,
  Title,
  Wrapper,
} from './styles';

function WrapProject({ children, variant, projectId }: {
  children: ReactElement,
  variant?: 'card' | 'display',
  projectId: string,
}) {
  if (variant === 'display') {
    return (
      <DisplayWrapper>
        {children}
      </DisplayWrapper>
    );
  }

  return (
    <Link href={`/projects/${projectId}`} passHref>
      <Wrapper>
        {children}
      </Wrapper>
    </Link>
  );
}

function Project({ data, variant }: {
  data: ProjectDocument.Populated,
  variant?: 'card' | 'display',
}) {
  const { t } = useTranslation(['common', 'components']);

  const displayDueDate = data.dueDate && data.status !== 'completed';
  let dueDateVariant: 'warning' | 'overdue' | undefined;

  if (displayDueDate) {
    const oneDay = 1000 * 60 * 60 * 24;
    const dateDiff = new Date(data.dueDate!).getTime() - new Date().getTime();

    if (dateDiff < 0) {
      dueDateVariant = 'overdue';
    } else if (dateDiff < oneDay * 3) {
      dueDateVariant = 'warning';
    }
  }

  return (
    <WrapProject variant={variant} projectId={data._id}>
      <>
        <PreHeadSection>
          {data.status === 'completed' && data.completedDate && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('components:project.completedDate')}</Tooltip>}
            >
              <IconTextWrapper>
                <p>{dayjs(data.completedDate).format('L')}</p>
                <StyledCheckIcon />
              </IconTextWrapper>
            </OverlayTrigger>
          )}
          {displayDueDate && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('components:project.dueDate')}</Tooltip>}
            >
              <IconTextWrapper variant={dueDateVariant}>
                <p>{dayjs().to(dayjs(data.dueDate))}</p>
                <StyledTimeIcon variant={dueDateVariant} />
              </IconTextWrapper>
            </OverlayTrigger>
          )}
          {!!data.skippedSamples && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('components:project.skippedSamples')}</Tooltip>}
            >
              <IconTextWrapper>
                <p>{data.skippedSamples}</p>
                <StyledSkipIcon />
              </IconTextWrapper>
            </OverlayTrigger>
          )}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{t('components:project.numberOfSamples')}</Tooltip>}
          >
            <IconTextWrapper>
              <p>{data.nbSamples}</p>
              <StyledAudioIcon />
            </IconTextWrapper>
          </OverlayTrigger>
        </PreHeadSection>
        <HeadSection>
          <Title>{data.title}</Title>
          <Status status={data.status}>
            {t(`common:projectStatus.${data.status}`)}
          </Status>
        </HeadSection>
        <Provider>
          {data.provider && (
          <>
            {t('components:project.providedBy')}
              &nbsp;
            <b>{data.provider}</b>
          </>
          )}
        </Provider>
        <ProgressPlaceholder>
          {!!data.nbSamples && (
          <>
            <ProgressWrapper>
              <AnnotationProgressWrapper>
                <div>
                  {t('components:project.annotation')}
                  &nbsp;
                  -
                  &nbsp;
                  {parseFloat(
                    ((data.annotatedSamples / data.nbSamples) * 100).toFixed(1),
                  )}
                  %
                  &nbsp;
                  {t('common:progress')}
                </div>
                {!!data.rejectedSamples && (
                  <RejectedReviews>
                    {data.rejectedSamples}
                    &nbsp;
                    {t('components:project.rejections')}
                  </RejectedReviews>
                )}
              </AnnotationProgressWrapper>
              <ProgressBar className="mt-2">
                <ProgressBar
                  variant="success"
                  max={data.nbSamples}
                  now={data.annotatedSamples}
                  key={1}
                />
                <ProgressBar
                  variant="danger"
                  max={data.nbSamples}
                  now={data.rejectedSamples}
                  key={2}
                />
              </ProgressBar>
            </ProgressWrapper>
            <ProgressWrapper>
              <div>
                {t('components:project.review')}
                &nbsp;
                -
                &nbsp;
                {parseFloat(
                  ((data.reviewedSamples / data.nbSamples) * 100).toFixed(1),
                )}
                %
                &nbsp;
                {t('common:progress')}
              </div>
              <ProgressBar
                max={data.nbSamples}
                now={data.reviewedSamples}
                className="mt-2"
              />
            </ProgressWrapper>
          </>
          )}
        </ProgressPlaceholder>
        <DateWrapper variant={variant}>
          <DateDisplay>
            {t('common:createdAt')}
            &nbsp;
            {dayjs(data.createdAt).format('L - HH:mm')}
          </DateDisplay>
          <DateDisplay>
            {t('common:updatedAt')}
            &nbsp;
            {dayjs(data.updatedAt).format('L - HH:mm')}
          </DateDisplay>
        </DateWrapper>
      </>
    </WrapProject>
  );
}

export default Project;
