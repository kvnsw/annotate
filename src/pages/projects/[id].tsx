import axios from 'axios';
import { GetStaticPropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AudioSampleDocument } from '../api/audio-samples';
import { ProjectDocument } from '../api/projects';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import ProjectLayout from '../../components/layouts/Project';
import { resetPlayer, setCurrentTrack } from '../../store/slices/playerSlice';

function Projects({ id }: { id: string }) {
  const { t } = useTranslation('common');

  const { accountType } = useAppSelector(state => state.user.data!);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<ProjectDocument.Populated | undefined>(undefined);
  const [isUpdating, setUpdating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSamples, setLoadingSample] = useState(false);
  const [isUpdatingSample, setUpdatingSample] = useState(false);
  const [samplesData, setSamplesData] = useState<{
    count: number, data: AudioSampleDocument.Base[] } | undefined
  >(undefined);
  const [samplesPage, setSamplesPage] = useState(0);

  const updateProject = async (updateData: ProjectDocument.Editable) => {
    setUpdating(true);

    try {
      const res = await axios.put<ProjectDocument.Populated>(`/api/projects/${id}`, updateData, {
        headers: {
          'x-auth': accountType,
        },
      });

      setData(res.data);
    } catch (error: any) {
      if (error.isAxiosError) {
        toast(t(`common:errors.${error.response.status}`));
      } else {
        toast(t('common:errors.500'));
      }
    } finally {
      setUpdating(false);
    }
  };

  const getProject = async () => {
    try {
      setLoading(false);

      const res = await axios.get<ProjectDocument.Populated>(`/api/projects/${id}`, {
        headers: {
          'x-auth': accountType,
        },
      });

      setData(res.data);
    } catch (error: any) {
      if (error.isAxiosError) {
        toast(t(`common:errors.${error.response.status}`));
      } else {
        toast(t('common:errors.500'));
      }
    } finally {
      setLoading(false);
    }
  };

  const getAudioSamples = async (scrollToTop = true) => {
    if (data?._id) {
      setLoadingSample(true);

      try {
        const res = await axios.get<{ count: number, data: AudioSampleDocument.Base[] }>(
          `/api/projects/${data._id}/audio-samples?page=${samplesPage}`,
          {
            headers: {
              'x-auth': accountType,
            },
          },
        );

        setSamplesData(res.data);
      } catch (error: any) {
        if (error.isAxiosError) {
          toast(t(`common:errors.${error.response.status}`));
        } else {
          toast(t('common:errors.500'));
        }
      } finally {
        setLoadingSample(false);

        if (scrollToTop) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const updateAudioSample = async (
    sampleId: string,
    updateData: AudioSampleDocument.Editable,
    scrollToTop = true,
  ) => {
    setUpdatingSample(true);

    try {
      const res = await axios.put<AudioSampleDocument.Base>(`/api/audio-samples/${sampleId}`, updateData, {
        headers: {
          'x-auth': accountType,
        },
      });

      dispatch(setCurrentTrack(res.data));
      await Promise.all([getAudioSamples(scrollToTop), getProject()]);
    } catch (error: any) {
      if (error.isAxiosError) {
        toast(t(`common:errors.${error.response.status}`));
      } else {
        toast(t('common:errors.500'));
      }
    } finally {
      setUpdatingSample(false);
    }
  };

  useEffect(() => {
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, id, accountType]);

  useEffect(() => {
    getAudioSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?._id, samplesPage, accountType, t]);

  // Unmount
  useEffect(() => () => {
    dispatch(resetPlayer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return null;

  return (
    <ProjectLayout
      data={data!}
      isUpdating={isUpdating}
      update={updateProject}
      samplesPage={samplesPage}
      setSamplesPage={setSamplesPage}
      isLoading={isLoading}
      isLoadingSamples={isLoadingSamples}
      isUpdatingSample={isUpdatingSample}
      updateSample={updateAudioSample}
      samplesData={samplesData}
      refreshAudioSamples={async () => {
        await Promise.all([getAudioSamples(), getProject()]);
      }}
    />
  );
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ id: string }>) => ({
  props: {
    ...await serverSideTranslations(ctx.locale!, ['common', 'pages', 'components']),
    id: ctx.params!.id,
  },
});

export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export default Projects;
