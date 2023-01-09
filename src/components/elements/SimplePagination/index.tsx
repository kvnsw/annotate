import { Pagination } from 'react-bootstrap';

import { StyledPagination } from './styles';

function SimplePagination({ nbPages, currentPage, setPage }: {
  nbPages: number, currentPage: number, setPage: Function,
}) {
  if (nbPages < 2) return null;

  return (
    <StyledPagination>
      <Pagination.Prev
        disabled={currentPage === 0}
        onClick={() => setPage(currentPage - 1)}
      />
      <div>
        {currentPage + 1}
        /
        {nbPages}
      </div>
      <Pagination.Next
        disabled={currentPage === nbPages - 1}
        onClick={() => setPage(currentPage + 1)}
      />
    </StyledPagination>
  );
}

export default SimplePagination;
