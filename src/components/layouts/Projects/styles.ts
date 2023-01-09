import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;
`;

export const NoProjects = styled.div`
  width: 100%;
  font-weight: 300;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  text-align: center;
`;
