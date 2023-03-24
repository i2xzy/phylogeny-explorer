import styled from 'styled-components';
import { transparentize } from 'polished';
import { Heading, BodyText } from 'components/Typography';

interface ClickProps {
  size: number;
}

export const ClickWrapper = styled.button.attrs({ type: 'button' })<ClickProps>`
  cursor: pointer;
  display: flex;
  background: none;
  border: 0;
  border-radius: 50%;
  padding: ${props => props.theme.spacer * props.size}px;
  margin: -${props => props.theme.spacer * props.size}px;
  color: inherit;

  &:hover {
    outline: none;
    background: ${props => transparentize(0.95, props.theme.dgrey)};
    box-shadow: 0 0 0 3px ${props => transparentize(0.95, props.theme.dgrey)};
  }

  &:focus {
    outline: none;
  }
`;

export const StoryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacer}px;
`;

export const StoryTitle = styled(Heading)`
  margin-bottom: ${props => props.theme.spacer}px;
`;

export const StoryItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 25%;
  margin-bottom: ${props => props.theme.smallSpacer}px;
`;

export const StoryItemName = styled(BodyText)`
  margin-left: ${props => props.theme.spacer}px;
`;
