import React, { useEffect, useState } from 'react';
import { useDialog } from '@/context/DialogContext';
import {
  getUserInfo,
  updateUser,
  uploadProfileImage,
} from '@/services/frontend/userService';
import { getErrorMessage } from '@/utils/errorUtils';

const EditPersonalInfo: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [anonymousId, setAnonymousId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const { openInfoDialog } = useDialog();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo();
        if (res.success) {
          const data = res.data;
          setName(data.name);
          setEmail(data.email);
          setAnonymousId(data.anonymousId || '');
          setLocalUser(data);
        }
      } catch (err) {
        openInfoDialog({ title: '錯誤', content: getErrorMessage(err) });
      }
    };
    fetchUserInfo();
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'face'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'profile') {
        setProfileImage(url);
      } else {
        setFaceImage(url);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      openInfoDialog({ title: '錯誤', content: '請填寫所有必填欄位' });
      return;
    }

    try {
      const res = await updateUser({ name, email, anonymousId });
      if (!res.success) {
        openInfoDialog({ title: '錯誤', content: res.message || '更新失敗' });
        return;
      }

      if (profileImage && localUser?.id) {
        const success = await uploadProfileImage(localUser.id, profileImage);
        if (!success) {
          openInfoDialog({ title: '錯誤', content: '頭像上傳失敗' });
        }
      }

      openInfoDialog({ title: '成功', content: '資料已更新' });
    } catch (err) {
      openInfoDialog({ title: '錯誤', content: getErrorMessage(err) });
    }
  };

  return (
    <div className="edit-info">
      <h2 className="edit-info__title">個人資料</h2>

      <div className="edit-info__field">
        <label className="edit-info__label">姓名 *</label>
        <input
          className="edit-info__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入真實姓名"
        />
      </div>

      <div className="edit-info__field">
        <label className="edit-info__label">暱稱 *</label>
        <input
          className="edit-info__input"
          value={anonymousId}
          onChange={(e) => setAnonymousId(e.target.value)}
          placeholder="請輸入暱稱"
        />
      </div>

      <div className="edit-info__field">
        <label className="edit-info__label">連絡信箱 *</label>
        <input
          className="edit-info__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入 Email"
        />
      </div>

      <div className="edit-info__field">
        <label className="edit-info__label">頭像照片</label>
        {profileImage && (
          <img className="edit-info__avatar" src={profileImage} alt="頭像" />
        )}
        <input type="file" onChange={(e) => handleImageUpload(e, 'profile')} />
      </div>

      <div className="edit-info__actions">
        <button className="edit-info__submit" onClick={handleSubmit}>
          完成
        </button>
      </div>
    </div>
  );
};

export default EditPersonalInfo;
