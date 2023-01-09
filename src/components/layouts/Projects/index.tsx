import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

import { ProjectDocument } from '../../../pages/api/projects';

import { useAppSelector } from '../../../store/hooks';

import Project from '../../elements/Project';
import SimplePagination from '../../elements/SimplePagination';
import ProjectAddEdit from '../forms/ProjectAddEdit';

import { GenericHeadSection, GenericPageLayout, GenericTitle } from '../../../theme/global.styles';

import { ListWrapper, NoProjects } from './styles';

function ProjectsLayout({
  page,
  setPage,
  isLoading,
  data,
  isCreating,
  create,
}: {
  page: number,
  setPage: Function,
  isLoading: boolean,
  data: { count: number, data: ProjectDocument.Populated[] } | undefined,
  isCreating: boolean,
  create: (_d: ProjectDocument.Editable) => Promise<void>,
}) {
  const { t } = useTranslation(['common', 'pages']);

  const { accountType } = useAppSelector(state => state.user.data!);

  const [modalOpened, setModalOpen] = useState(false);

  return (
    <GenericPageLayout isLoading={isLoading}>
      <GenericHeadSection>
        <GenericTitle>
          {t('pages:projects.title', { count: data?.count || 0 })}
        </GenericTitle>
        {accountType === 'admin' && (
          <Button type="button" onClick={() => setModalOpen(true)}>
            {t('pages:projects.createNew')}
          </Button>
        )}
      </GenericHeadSection>
      {data && !data.count && (
        <NoProjects>
          {t('pages:projects.noProjectsYet')}
        </NoProjects>
      )}
      <ListWrapper>
        {data?.data.map(project => (
          <Project key={project._id} data={project} />
        ))}
      </ListWrapper>
      <SimplePagination
        nbPages={Math.ceil((data?.count || 0) / 12)}
        currentPage={page}
        setPage={setPage}
      />
      <ProjectAddEdit
        show={modalOpened}
        onHide={() => setModalOpen(false)}
        isSubmitting={isCreating}
        onSubmit={create}
      />
    </GenericPageLayout>
  );
}

export default ProjectsLayout;
