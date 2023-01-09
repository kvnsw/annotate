import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';

import { ProjectDocument } from '../../../../pages/api/projects';

import { Title } from './styles';

function ProjectAddEdit({ data, show, onHide, isSubmitting, onSubmit }: {
  data?: ProjectDocument.Base,
  show: boolean,
  onHide: () => void,
  isSubmitting: boolean,
  onSubmit: (_d: ProjectDocument.Editable) => Promise<void>,
}) {
  const { t } = useTranslation(['common', 'pages']);

  const titleInputRef = useRef<HTMLInputElement>();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      onShow={() => titleInputRef?.current?.focus()}
    >
      <Title>
        {data
          ? t('pages:forms.projectAddEdit.modify')
          : t('pages:forms.projectAddEdit.create')}
      </Title>
      <Formik
        onSubmit={async (formData) => {
          await onSubmit(formData);
          onHide();
        }}
        initialValues={{
          title: data?.title || '',
          provider: data?.provider || '',
          dueDate: data?.dueDate
            ? dayjs(data!.dueDate).format('YYYY-MM-DD')
            : dayjs().add(7, 'day').format('YYYY-MM-DD'),
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required(),
          provider: Yup.string(),
          dueDate: Yup.date(),
        })}
      >
        {({ handleChange, handleSubmit, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <fieldset
              disabled={isSubmitting}
              className="d-flex flex-column justify-content-end"
            >
              <Form.Group controlId="formProjectTitle" className="mb-4">
                <Form.Label className="label">
                  {t('pages:forms.projectAddEdit.title')}
                </Form.Label>
                <Form.Control
                  ref={titleInputRef as any}
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  isInvalid={touched.title && !!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formProjectProvider" className="mb-4">
                <Form.Label className="label">
                  {t('pages:forms.projectAddEdit.provider')}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="provider"
                  value={values.provider}
                  onChange={handleChange}
                  isInvalid={touched.provider && !!errors.provider}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.provider}
                </Form.Control.Feedback>
              </Form.Group>

              {data?.status !== 'completed' && (
              <Form.Group controlId="formProjectDueDate" className="mb-4">
                <Form.Label className="label">
                  {t('pages:forms.projectAddEdit.dueDate')}
                </Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={handleChange}
                  isInvalid={touched.dueDate && !!errors.dueDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dueDate}
                </Form.Control.Feedback>
              </Form.Group>
              )}

              <Button variant="primary" type="submit" className="ms-auto">
                {t('common:form.submit')}
              </Button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ProjectAddEdit;
