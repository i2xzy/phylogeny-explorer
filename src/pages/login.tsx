import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Auth } from 'aws-amplify';
import jwt from 'jsonwebtoken';

import useUser from 'lib/hooks/useUser';
import Page from 'components/layout/Page';
import Button from 'components/Button';
// import SocialButton from 'components/SocialButton';
import { Heading } from 'components/Typography';
import {
  Wrapper,
  Form,
  Header,
  Text,
  ButtonWrapper,
  ErrorMessage,
} from 'components/Form';
import Field from 'components/Field';
import { loginContent } from 'static/login';

const { background, errorMessage, devErrorMessage } = loginContent;

const env = process.env.NEXT_PUBLIC_API_BASE || 'dev';

const Login = () => {
  const { query } = useRouter();
  const { isLoggedIn, isLoadingUser, setSession } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = ({ email, password }) => {
    setError('');
    setLoading(true);

    Auth.signIn(email, password)
      .then(user => {
        const token = user.signInUserSession.accessToken.jwtToken;
        const decoded = jwt.decode(token);

        const groups: string[] = decoded['cognito:groups'];

        const canLoginToDev = new Set(['devTeam', 'admin']);
        const canLoginToProd = new Set(['viewers', ...canLoginToDev]);

        if (
          groups.filter(group =>
            (env === 'prod' ? canLoginToProd : canLoginToDev).has(group)
          ).length > 0
        ) {
          setSession(token);
        } else {
          throw new Error(env === 'prod' ? errorMessage : devErrorMessage);
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

  if (isLoadingUser || isLoggedIn) return null;

  return (
    <Page backgroundImage={background}>
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
            password: '',
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
        {/* <Text>
          <Link href="/forgot-password">Forgot your password?</Link>
        </Text> */}
      </Wrapper>
    </Page>
  );
};

export default Login;
