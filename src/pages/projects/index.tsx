import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ProjectDocument } from '../api/projects';

import { useAppSelector } from '../../store/hooks';

import ProjectsLayout from '../../components/layouts/Projects';

function Projects() {
  const { t } = useTranslation(['common', 'pages']);

  const router = useRouter();

  const { accountType } = useAppSelector(state => state.user.data!);

  const [data, setData] = useState<{
    count: number, data: ProjectDocument.Populated[] } | undefined
  >(undefined);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const createProject = async (createData: ProjectDocument.Editable) => {
    setIsCreating(true);

    try {
      const res = await axios.post<ProjectDocument.Base>('/api/projects', createData, {
        headers: {
          'x-auth': accountType,
        },
      });

      router.push(`/projects/${res.data._id}`);
    } catch (error: any) {
      if (error.isAxiosError) {
        toast(t(`common:errors.${error.response.status}`));
      } else {
        toast(t('common:errors.500'));
      }
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    axios.get<{ count: number, data: ProjectDocument.Populated[] }>(`/api/projects?page=${page}`, {
      headers: {
        'x-auth': accountType,
      },
    })
      .then(res => setData(res.data))
      .catch(error => toast(t(`common:errors.${error.response.status}`)))
      .finally(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [page, accountType, t]);

  return (
    <ProjectsLayout
      page={page}
      setPage={setPage}
      isLoading={isLoading}
      data={data}
      isCreating={isCreating}
      create={createProject}
    />
  );
}

export const getStaticProps = async ({ locale }: { locale: 'en' }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'pages', 'components']),
  },
});

export default Projects;
