import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/context/frontend/LoadingContext';
import MCard from '@/components/frontend/MCard';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';
import { getErrorMessage } from '@/utils/errorUtils';
import { loginUser } from '@/services/frontend/LoginService';
import {
  registerUser,
  uploadProfileImage,
} from '@/services/frontend/userService';
import { setUser, setToken } from '@/store/slices/frontend/authSlice';
import { useDispatch } from 'react-redux';
import { useDialog } from '@/context/DialogContext';
const schema = yup.object({
  countryCode: yup.string().required(),
  phone: yup.string().required('請輸入手機號碼'),
  verificationCode: yup.string().nullable(),
  email: yup.string().email().required('請輸入信箱'),
  name: yup.string().required('請輸入姓名'),
  password: yup.string().required('請輸入密碼').min(6, '密碼至少6位'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '密碼不一致')
    .required('請再次輸入密碼'),
  gender: yup.string().required('請選擇性別'),
  anonymousId: yup.string(),
  profileImage: yup.mixed().nullable(),
  agreeTerms: yup
    .boolean()
    .oneOf([true], '您必須同意網站服務條款和隱私權政策。'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const [timer, setTimer] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: '+886',
      phone: '',
      verificationCode: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      gender: '',
      anonymousId: '',
      profileImage: null,
      agreeTerms: false,
    },
  });

  const handleNextStep = async () => {
    const phone = watch('phone');
    const verificationCode = watch('verificationCode');
    const email = watch('email');

    if (!phone || !verificationCode || !email) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫手機號碼、驗證碼與信箱',
        confirmText: '我知道了',
      });
      return;
    }

    // TODO: 實際驗證驗證碼邏輯
    setStep(2);
  };

  const onSubmit = async (data: any) => {
    const {
      name,
      password,
      confirmPassword,
      gender,
      anonymousId,
      email,
      phone,
      countryCode,
      verificationCode,
      profileImage,
    } = data;

    if (!name || !gender || !password || !confirmPassword) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫所有必填欄位',
        confirmText: '我知道了',
      });
      return;
    }

    if (password !== confirmPassword) {
      await openInfoDialog({
        title: '錯誤',
        content: '密碼與確認密碼不一致',
        confirmText: '我知道了',
      });
      return;
    }

    const userData = {
      name,
      password,
      gender,
      anonymousId,
      email,
      phone,
      countryCode,
      verificationCode,
    };

    try {
      setLoading(true);
      const { success, data: resData, message } = await registerUser(userData);

      if (!success) {
        setLoading(false);
        await openInfoDialog({
          title: '錯誤',
          content: message || '註冊失敗，請重試',
          confirmText: '我知道了',
        });
        return;
      }

      const userId = resData.id;

      if (profileImage) {
        const uploadSuccess = await uploadProfileImage(userId, profileImage);
        if (!uploadSuccess) {
          await openInfoDialog({
            title: '錯誤',
            content: '頭像上傳失敗，請稍後重試',
            confirmText: '我知道了',
          });
        }
      }

      const loginResult = await loginUser({ type: 'email', email, password });

      if (!loginResult.success) {
        await openInfoDialog({
          title: '登入失敗',
          content: '帳號已建立，請手動登入',
          confirmText: '我知道了',
        });
        return;
      }

      const { accessToken, user } = loginResult.data;
      dispatch(setUser(user));
      dispatch(setToken(accessToken));
      setLoading(false);
      await openInfoDialog({
        title: '註冊成功',
        content: '歡迎加入！',
        confirmText: '進入首頁',
      });

      navigate('/main');
    } catch (error: any) {
      setLoading(false);
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
        confirmText: '我知道了',
      });
    }
  };

  const handleSendVerificationCode = async () => {
    const phone = watch('phone');
    const countryCode = watch('countryCode');

    if (!phone) {
      await openInfoDialog({
        title: '錯誤',
        content: '請先輸入手機號碼',
        confirmText: '我知道了',
      });
      return;
    }

    try {
      setLoading(true);
      console.log(`發送驗證碼至：${countryCode}${phone}`);
      setIsCodeSent(true);
      setTimer(60);
    } catch (error: any) {
      await openInfoDialog({
        title: '錯誤',
        content: '發送驗證碼失敗，請稍後再試',
        confirmText: '我知道了',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      <MCard customClass="mcard--register" title="註冊會員">
        <div className="register__container">
          <div className="register__form">
            {step === 1 && (
              <>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    信箱
                  </p>
                  <input
                    className="register__form-input"
                    {...register('email')}
                  />
                  <p className="register__text register__text--error">
                    {errors.email?.message}
                  </p>
                </div>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    手機號碼
                  </p>
                  <div className="register__input-group">
                    <select
                      className="register__form-input register__form-input--select"
                      defaultValue="+886"
                      {...register('countryCode')}
                    >
                      <option value="+886">+886（台灣）</option>
                      <option value="+81">+81（日本）</option>
                      <option value="+82">+82（韓國）</option>
                      <option value="+1">+1（美國）</option>
                    </select>

                    <input
                      className={`register__form-input ${
                        errors.phone ? 'register__form-input--error' : ''
                      }`}
                      type="tel"
                      placeholder="請輸入手機號碼"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="register__text register__text--error">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    驗證碼
                  </p>
                  <div className="register__input-group">
                    <input
                      className="register__form-input"
                      {...register('verificationCode')}
                    />
                    <button
                      type="button"
                      className="register__icon-btn"
                      onClick={handleSendVerificationCode}
                      disabled={timer > 0}
                    >
                      {timer > 0
                        ? `重新發送(${timer})`
                        : isCodeSent
                        ? '重新發送'
                        : '發送驗證碼'}
                    </button>
                  </div>
                  <p className="register__text register__text--error">
                    {errors.verificationCode?.message}
                  </p>
                </div>
                <div className="register__other-btn">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="register__btn"
                  >
                    下一步
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    姓名
                  </p>
                  <input
                    className="register__form-input"
                    {...register('name')}
                  />
                  <p className="register__text register__text--error">
                    {errors.name?.message}
                  </p>
                </div>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    密碼
                  </p>
                  <div className="register__input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="register__form-input"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="register__icon-btn"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                  <p className="register__text register__text--error">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    確認密碼
                  </p>
                  <div className="register__input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="register__form-input"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="register__icon-btn"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </button>
                  </div>
                  <p className="register__text register__text--error">
                    {errors.confirmPassword?.message}
                  </p>
                </div>
                <div className="register__form-inputs">
                  <p className="register__text">暱稱</p>
                  <input
                    className="register__form-input"
                    {...register('anonymousId')}
                  />
                </div>
                <div className="register__form-inputs">
                  <p className="register__text register__text--required">
                    性別
                  </p>
                  <select
                    className="register__form-input"
                    {...register('gender')}
                  >
                    <option value="">請選擇</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                  <p className="register__text register__text--error">
                    {errors.gender?.message}
                  </p>
                </div>
                <div className="register__form-inputs">
                  <p className="register__text">上傳頭像</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="register__form-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setValue('profileImage', imageUrl);
                      }
                    }}
                  />
                  {watch('profileImage') && (
                    <img src={watch('profileImage')} width="100" />
                  )}
                </div>
                <div className="register__checkbox">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    {...register('agreeTerms')}
                  />
                  <label htmlFor="agreeTerms">
                    我同意{' '}
                    <a href="/policy" target="_blank">
                      服務條款
                    </a>{' '}
                    與{' '}
                    <a href="/privacy" target="_blank">
                      隱私政策
                    </a>
                  </label>
                  <p className="register__text register__text--error">
                    {errors.agreeTerms?.message}
                  </p>
                </div>
                <div className="register__other-btn">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="register__btn"
                  >
                    {isSubmitting ? '提交中...' : '註冊'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </MCard>
    </form>
  );
};

export default Register;
