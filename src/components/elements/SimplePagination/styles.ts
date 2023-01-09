import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';

export const StyledPagination = styled(Pagination)`
  justify-content: center;
  align-items: center;
  margin-top: 40px;

  & > * {
    margin: 0 5px;
  }
`;
