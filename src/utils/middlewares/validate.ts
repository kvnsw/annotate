import withJoi from 'next-joi';

export default withJoi({
  onValidationError: (_, res, err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(400).end();
  },
});
