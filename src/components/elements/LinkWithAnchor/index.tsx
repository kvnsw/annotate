import Unwrapped, { LinkProps } from 'next/link';
import React from 'react';

function LinkWithAnchor({ children, ...props }: React.PropsWithChildren<LinkProps>) {
  return (
    <Unwrapped {...props}>
      <a>{children}</a>
    </Unwrapped>
  );
}

export default LinkWithAnchor;
