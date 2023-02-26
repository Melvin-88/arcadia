import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Button, ResetPasswordIcon, PasswordField, UserNameField,
} from 'arcadia-common-fe';
import { signIn } from '../../state/actions';
import { ISignInRequestBody } from '../../types';
import { authReducerSelector } from '../../state/selectors';
import { AuthWrapper } from '../AuthWrapper/AuthWrapper';
import './styles/SignIn.scss';

const SignIn = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(authReducerSelector);

  const onSubmit = useCallback((data: ISignInRequestBody) => {
    dispatch(signIn(data));
  }, [dispatch]);

  return (
    <AuthWrapper
      className="sign-in"
      title="Sign in"
      icon={(<ResetPasswordIcon className="sign-in__icon" />)}
    >
      <Form
        onSubmit={onSubmit}
        render={({
          handleSubmit,
          submitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <UserNameField className="sign-in__field" name="username" />
            <PasswordField className="sign-in__field" withSymbolsValidation={false} />
            <div className="sign-in__buttons">
              <Button
                color="secondary"
                type="submit"
                isLoading={isLoading}
                disabled={submitting}
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      />
    </AuthWrapper>
  );
};

export default SignIn;
