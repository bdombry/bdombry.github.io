import React from 'react';
import { useResetPasswordToken } from '@/hooks/useResetPasswordToken';
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm';
import ResetPasswordSuccess from '@/components/auth/ResetPasswordSuccess';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword: React.FC = () => {
  const { error: tokenError } = useResetPasswordToken();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error: formError,
    isLoading,
    isSuccess,
    handleSubmit
  } = useResetPasswordForm();

  const error = tokenError || formError;

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <ResetPasswordForm
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default ResetPassword;