import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import Page from 'components/Page';
import NavBar from 'components/NavBar';
import Search from 'components/Search';
import Button from 'components/Button';
import { HeadingLarge } from 'components/Typography';
import styled from 'styled-components';

// import { Wrapper } from "./Relationships.styled";
import MRCA from '../../lib/graphql/mrca';

const Relationships = () => {
  const { nodeId } = useRouter().query;

  const [clade1, setClade1] = useState(nodeId);
  const [clade2, setClade2] = useState('');
  const [skip, setSkip] = useState(true);

  const { loading, data } = useQuery(MRCA, {
    skip,
    variables: { clade1, clade2 },
  });

  const Wrapper = styled.div`
    display: grid;
    grid-gap: ${props => props.theme.xlargeSpacer}px;
    padding: ${props => props.theme.xlargeSpacer}px;
    max-width: 400px;
  `;

  return (
    <Page>
      <NavBar />
      <Wrapper>
        <HeadingLarge>Most Recent Common Ancestor</HeadingLarge>
        <Search value={clade1} handleSelect={id => setClade1(id)} isContained />
        <Search value={clade2} handleSelect={id => setClade2(id)} isContained />
        <Button
          text="search for common ancestor"
          loading={loading}
          disabled={!(clade1 && clade2)}
          onClick={() => setSkip(false)}
        />
        {data && <HeadingLarge>{data.mrca.name}</HeadingLarge>}
      </Wrapper>
    </Page>
  );
};

export default Relationships;
