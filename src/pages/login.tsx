import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Auth } from 'aws-amplify';
import jwt from 'jsonwebtoken';

import { LoginContext } from 'context/LoginContext';
import Page from 'components/Page';
import Button from 'components/Button';
// import SocialButton from 'components/SocialButton';
import { Heading } from 'components/Typography';
import {
  Wrapper,
  Form,
  Header,
  Text,
  Field,
  ButtonWrapper,
  ErrorMessage,
} from 'components/Form';
import PageHeader from 'components/PageHeader';
import backgroundImage from '../../public/images/background-login.jpg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { query, ...router } = useRouter();

  const { setSession } = useContext(LoginContext);

  const onSubmit = ({ email, password }) => {
    setError('');
    setLoading(true);

    Auth.signIn(email, password)
      .then(user => {
        const token = user.signInUserSession.accessToken.jwtToken;
        const decoded = jwt.decode(token);

        if (decoded['cognito:groups']?.includes('viewers')) {
          setSession(token);
          router.push('/');
        } else {
          throw new Error(
            'User is not approved to view. Contact dev team for beta access.'
          );
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Please enter your password'),
  });

  return (
    <Page backgroundImage={backgroundImage.src}>
      <PageHeader />
      <Wrapper>
        <Header>
          <Heading>Log in</Heading>
          <Text>
            {'or '}
            <Link href="/signup">sign up for an account</Link>
          </Text>
        </Header>

        {/* <SocialButton platform="facebook" text="Log in with Facebook" />
        <SocialButton platform="google" text="Log in with Google" />

        <Text>or</Text> */}

        <Formik
          initialValues={{
            email: query.email || '',
            password: query.password || '',
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Field
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
            />
            <Field
              name="password"
              type="password"
              autoComplete="password"
              placeholder="Password"
            />

            <ButtonWrapper>
              <Button type="submit" loading={loading} text="Log in" />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </ButtonWrapper>
          </Form>
        </Formik>
        <Text>
          <Link href="/forgot-password">Forgot your password?</Link>
        </Text>
      </Wrapper>
    </Page>
  );
};

export default Login;