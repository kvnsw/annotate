import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const LogInWrapper = styled.a`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
  cursor: pointer;
  width: 50%;
  height: 100vh;

  & span {
    opacity: 0.4;
    font-weight: 300;
    transition: opacity 200ms ease;
  }

  & div {
    font-size: 70px;
    font-weight: 700;
    opacity: 0.3;
    transition: opacity 200ms ease;
  }

  &:hover {
    & span {
      opacity: 0.6;
    }

    & div {
      opacity: 1;
    }
  }
`;

export const AdminWrapper = styled(LogInWrapper)`
  background-color: ${({ theme }) => theme.colors.white};
`;

export const OperatorWrapper = styled(LogInWrapper)`
  background-color: ${({ theme }) => theme.colors.rust};
`;
