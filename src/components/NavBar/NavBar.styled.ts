import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 328px 1fr auto;
  grid-auto-flow: column;
  grid-gap: ${props => props.theme.largeSpacer}px;
  align-items: center;
  height: ${props => props.theme.topBarHeight}px;
  padding: ${props => props.theme.spacer}px
    ${props => props.theme.xLargeSpacer}px;
  background: rgba(43, 48, 52, 0.96);
  box-sizing: border-box;
`;

export const NavItems = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${props => props.theme.largeSpacer}px;
  justify-content: start;
`;
