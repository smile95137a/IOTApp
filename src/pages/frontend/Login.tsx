import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '@/store/slices/frontend/authSlice';
import { RootState } from '@/store';
import { loginUser } from '@/services/frontend/LoginService';
import { useLoading } from '@/context/frontend/LoadingContext';
import MCard from '@/components/frontend/MCard';
import logo from '@/assets/image/i-Pool_logo_RGB_2.png';
import { getLoginUrl } from '@/utils/AuthUtils';
import { useDialog } from '@/context/DialogContext';
import { getErrorMessage } from '@/utils/errorUtils';

interface LoginFormValues {
  email?: string;
  phone?: string;
  password: string;
}

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();
  const { setLoading } = useLoading();

  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const [isStart, setIsStart] = useState(false);
  const [loginType, setLoginType] = useState<'phone' | 'email' | null>(
    (location.state?.loginType as 'phone' | 'email') || null
  );
  const [countryCode] = useState('+886');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  useEffect(() => {
    if (isLogin) {
      navigate('/main');
    }
  }, [isLogin, navigate]);

  const handleOauthLogin = (provider: string) => {
    window.location.href = getLoginUrl(provider);
  };

  const onSubmit = async (values: LoginFormValues) => {
    const loginData =
      loginType === 'phone'
        ? {
            type: 'phone',
            countryCode,
            phone: values.phone,
            password: values.password,
          }
        : {
            type: 'email',
            email: values.email,
            password: values.password,
          };

    try {
      setLoading(true);
      const { success, data, message } = await loginUser(loginData);
      setLoading(false);

      if (success) {
        dispatch(setUser(data.user));
        dispatch(setToken(data.accessToken));
        navigate('/main', { replace: true });
      } else {
        await openInfoDialog({
          title: '系統提示',
          content: message || '登入失敗，請稍後再試！',
        });
      }
    } catch (error: any) {
      setLoading(false);

      await openInfoDialog({ title: '錯誤', content: getErrorMessage(error) });
    }
  };

  const handleForgotPassword = () => {
    // TODO: 忘記密碼導頁
  };

  const forwardRegistration = () => {
    navigate('/register');
  };

  return (
    <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">會員登入</h2>
        <div className="login__container">
          <div className="login__main">
            <div className="login__left">
              {!isStart ? (
                <div className="login__auths">
                  <div className="login__toggle">
                    <button
                      type="button"
                      className="login__toggle-btn"
                      onClick={() => {
                        setLoginType('email');
                        setIsStart(true);
                      }}
                    >
                      Email 登入
                    </button>
                    <button
                      type="button"
                      className="login__toggle-btn"
                      onClick={() => {
                        setLoginType('phone');
                        setIsStart(true);
                      }}
                    >
                      手機登入
                    </button>
                  </div>
                  <div className="login__divider">
                    <div className="login__divider-line" />
                    <div className="login__divider-text">或</div>
                  </div>

                  <div className="login__auth">
                    <div
                      className="login__auth-btn"
                      onClick={() => handleOauthLogin('google')}
                    >
                      <div className="login__auth-btn-icon" />
                      <div className="login__auth-btn-text">
                        Google 帳號登入
                      </div>
                    </div>
                    <div
                      className="login__auth-btn"
                      onClick={() => handleOauthLogin('facebook')}
                    >
                      <div className="login__auth-btn-icon" />
                      <div className="login__auth-btn-text">Facebook 登入</div>
                    </div>
                    <div
                      className="login__auth-btn"
                      onClick={() => handleOauthLogin('apple')}
                    >
                      <div className="login__auth-btn-icon" />
                      <div className="login__auth-btn-text">Apple ID 登入</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
                  {loginType === 'email' ? (
                    <div className="login__form-inputs">
                      <p className="login__text">電子信箱</p>
                      <input
                        className={`login__form-input ${
                          errors.email ? 'input-error' : ''
                        }`}
                        type="email"
                        placeholder="請輸入電子信箱"
                        {...register('email', {
                          required: '電子信箱是必填項',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: '電子信箱格式錯誤',
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="error-text">{errors.email.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="login__form-inputs">
                      <p className="login__text">手機號碼</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          className="login__form-input"
                          style={{ maxWidth: '100px' }}
                          defaultValue="+886"
                          {...register('countryCode', { required: true })}
                        >
                          <option value="+886">+886（台灣）</option>
                          <option value="+81">+81（日本）</option>
                          <option value="+82">+82（韓國）</option>
                          <option value="+1">+1（美國）</option>
                        </select>

                        <input
                          className={`login__form-input ${
                            errors.phone ? 'input-error' : ''
                          }`}
                          type="tel"
                          placeholder="請輸入手機號碼"
                          {...register('phone', {
                            required: '手機號碼是必填項',
                            pattern: {
                              value: /^09\d{8}$/,
                              message: '手機格式錯誤，需為 09 開頭共 10 碼',
                            },
                          })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="error-text">{errors.phone.message}</p>
                      )}
                    </div>
                  )}

                  <div className="login__form-inputs">
                    <p className="login__text">密碼</p>
                    <input
                      className={`login__form-input ${
                        errors.password ? 'input-error' : ''
                      }`}
                      type="password"
                      placeholder="請輸入密碼"
                      {...register('password', {
                        required: '密碼是必填項',
                      })}
                    />
                    {errors.password && (
                      <p className="error-text">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="login__forgot">
                    <p
                      className="login__text login__text--forgot"
                      onClick={handleForgotPassword}
                    >
                      忘記密碼?
                    </p>
                  </div>

                  <div className="login__btns">
                    <button
                      type="submit"
                      className="login__btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '登入中...' : '登入'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="login__right">
              <div className="login__other">
                <div className="login__other-img">
                  <img src={logo} alt="Logo" />
                </div>
                <div className="login__other-info">
                  <p className="login__text">
                    尚未加入會員？點此
                    <span
                      className="login__register-link"
                      onClick={forwardRegistration}
                    >
                      註冊
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
