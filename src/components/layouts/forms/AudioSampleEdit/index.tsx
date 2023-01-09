import { useTranslation } from 'next-i18next';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Howl } from 'howler';

import { AudioSampleDocument } from '../../../../pages/api/audio-samples';
import { useAppSelector } from '../../../../store/hooks';

import { TimerIcon } from './styles';

function AudioSampleEdit({ data, isSubmitting, onSubmit }: {
  data: AudioSampleDocument.Base,
  isSubmitting: boolean,
  onSubmit: (_id: string, _d: AudioSampleDocument.Editable, _s?: boolean) => Promise<void>,
}) {
  const { t } = useTranslation(['common', 'pages']);
  const { accountType } = useAppSelector(state => state.user.data!);
  const { duration } = useAppSelector(state => state.player);

  // Always only a single instance of howl globally
  const howl = (global as typeof globalThis & {
    Howler?: HowlerGlobal & { _howls: Howl[] }
  }).Howler?._howls?.[0];

  const getHowlCurrentTime = () => howl?.seek() || 0;

  const formDisabled = isSubmitting
    || accountType === 'admin'
    || !['ongoing', 'rejected'].includes(data.status);

  return (
    <div className="mt-4">
      {/* Show text when sample has been skipped */}
      {data.skipped && ['review', 'accepted'].includes(data.status) && (
        <p className="text-center">
          {t('pages:forms.audioSampleEdit.annotationSkipped')}
        </p>
      )}
      {/* Show text to admin when sample is not annotated yet */}
      {accountType === 'admin' && ['ongoing', 'rejected'].includes(data.status) && (
        <p className="text-center">
          {t('pages:forms.audioSampleEdit.annotationOngoing')}
        </p>
      )}
      {/**
       * Operator always sees form
       * Admin can only see form when sample is not ongoing and not rejected
       * In both cases, form is not visible if sample is skipped and status is review or accepted
       */}
      {(
        (accountType === 'operator' || !['ongoing', 'rejected'].includes(data.status))
        && !(data.skipped && ['review', 'accepted'].includes(data.status))
      ) && (
      <Formik
        onSubmit={formData => onSubmit(
          data._id,
          {
            annotations: {
              wake: {
                start: formData.wakeStart,
                end: formData.wakeEnd,
              },
              utterance: {
                transcript: formData.utteranceTranscript,
                start: formData.utteranceStart,
                end: formData.utteranceEnd!,
              },
            },
            status: 'review',
          },
          false,
        )}
        initialValues={{
          wakeStart: data.annotations?.wake?.start || 0,
          wakeEnd: data.annotations?.wake?.end || 0,
          utteranceTranscript: data.annotations?.utterance?.transcript || '',
          utteranceStart: data.annotations?.utterance?.start || 0,
          utteranceEnd: data.annotations?.utterance?.end || 0,
        }}
        validationSchema={Yup.object().shape({
          wakeStart: Yup.number().min(0).max(duration).required(),
          wakeEnd: Yup.number().min(0).max(duration).moreThan(Yup.ref('wakeStart'))
            .required(),
          utteranceTranscript: Yup.string().required(),
          utteranceStart: Yup.number().min(0).max(duration).required(),
          utteranceEnd: Yup.number().min(0).max(duration).moreThan(Yup.ref('utteranceStart'))
            .required(),
        })}
      >
        {({ handleChange, setFieldValue, handleSubmit, values, touched, errors }) => {
          function renderTimeFormGroup(controlId: string, name: keyof typeof values) {
            return (
              <Form.Group as={Col} controlId={controlId}>
                <Form.Label className="label">
                  {t(`pages:forms.audioSampleEdit.${name}`)}
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="number"
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    isInvalid={touched[name] && !!errors[name]}
                  />
                  {!formDisabled && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setFieldValue(
                      name,
                      Math.round(getHowlCurrentTime() * 100) / 100,
                      true,
                    )}
                  >
                    <TimerIcon />
                  </Button>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors[name]}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            );
          }

          return (
            <Form noValidate onSubmit={handleSubmit}>
              <fieldset disabled={formDisabled}>
                <Row className="mb-4">
                  {renderTimeFormGroup('formWakeStart', 'wakeStart')}
                  {renderTimeFormGroup('formWakeEnd', 'wakeEnd')}
                </Row>

                <Row className="mb-4">
                  {renderTimeFormGroup('formUtteranceStart', 'utteranceStart')}
                  {renderTimeFormGroup('formUtteranceEnd', 'utteranceEnd')}
                </Row>

                <Form.Group controlId="formUtteranceTranscript">
                  <Form.Label className="label">
                    {t('pages:forms.audioSampleEdit.utteranceTranscript')}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="utteranceTranscript"
                    value={values.utteranceTranscript}
                    onChange={handleChange}
                    isInvalid={touched.utteranceTranscript && !!errors.utteranceTranscript}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.utteranceTranscript}
                  </Form.Control.Feedback>
                </Form.Group>

                {accountType === 'operator' && ['ongoing', 'rejected'].includes(data.status) && (
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="info"
                    type="button"
                    onClick={() => onSubmit(data._id, { skipped: true, status: 'review' }, false)}
                  >
                    {t('pages:forms.audioSampleEdit.skip')}
                  </Button>
                  <Button variant="primary" type="submit">
                    {t('common:form.submit')}
                  </Button>
                </div>
                )}
              </fieldset>
            </Form>
          );
        }}
      </Formik>
      )}
      {/* Show admin actions only on review mode */}
      {accountType === 'admin' && data.status === 'review' && (
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="danger"
            type="button"
            onClick={() => onSubmit(data._id, { status: 'rejected' }, false)}
          >
            {t('pages:forms.audioSampleEdit.reject')}
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={() => onSubmit(data._id, { status: 'accepted' }, false)}
          >
            {t('pages:forms.audioSampleEdit.accept')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AudioSampleEdit;
