import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { Input, Button, Text, Card } from '@alphacore/ui-kit';

import logoSvg from '../../assets/logo.svg';
import { LOGIN_MUTATION } from '../../graphql/operations';
import { saveAuth } from '../../services/auth';
import type { AuthPayload } from '../../types';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  const emailError = emailTouched && !email ? 'Введите адрес электронной почты' : null;
  const passwordError = passwordTouched && !password ? 'Введите пароль' : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    setError('');

    if (!email || !password) return;

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      if (data?.login) {
        saveAuth(data.login.token, data.login.user);
        navigate('/main');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    }
  };

  return (
    <div className="login-page">
      <img src={logoSvg} alt="logo" className="login-logo-img" />
      <Card className="login-card">
        <Text variant="Font4" as="h2" className="login-title">Войдите в аккаунт</Text>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="field-label">Адрес электронной почты<span className="asterisk">*</span></label>
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@admin.com"
              error={emailError}
              className={emailError ? 'input-has-error' : ''}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Пароль<span className="asterisk">*</span></label>
            <Input
              type="password"
              passwordField
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              error={passwordError}
              className={passwordError ? 'input-has-error' : ''}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <Button
            variant="basic"
            className="btn-submit"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit as unknown as React.MouseEventHandler}
          >
            Продолжить
          </Button>
        </form>

        <div className="login-footer">
          <a href="/" className="link">Не удается войти в систему?</a>
        </div>
      </Card>
    </div>
  );
}
