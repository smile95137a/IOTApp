import FrontendLayout from '@/components/layout/FrontendLayout';
import FLogin from '@/pages/frontend/Login';
import FMain from '@/pages/frontend/Main';
import NotFound from '@/pages/frontend/NotFound';
import Register from '@/pages/frontend/Register';
import { FC } from 'react';
import { RouteObject, Navigate, useRoutes } from 'react-router-dom';
import NewsDetail from '@/pages/frontend/NewsDetail';
import News from '@/pages/frontend/News';
import About from '@/pages/frontend/About';
import Faq from '@/pages/frontend/Faq';
import Policy from '@/pages/frontend/Policy';
import Privacy from '@/pages/frontend/Privacy';
import { LoadingProvider } from '@/context/frontend/LoadingContext';
import RestPwd from '@/pages/frontend/RestPwd';
import Deposit from '@/pages/frontend/memberCenter/Deposit';
import Store from '@/pages/frontend/Store';
import StoreDetail from '@/pages/frontend/StoreDetail';
import MemberCenter from '@/pages/frontend/memberCenter/MemberCenter';
import ProfileEdit from '@/pages/frontend/memberCenter/ProfileEdit';
import DepositHistory from '@/pages/frontend/memberCenter/DepositHistory';
import TransactionHistory from '@/pages/frontend/memberCenter/TransactionHistory';
import Payment from '@/pages/frontend/Payment';
import Reservation from '@/pages/frontend/Reservation';
import PaymentSuccess from '@/pages/PaymentSuccess';
import GameOngoing from '@/pages/frontend/memberCenter/GameOngoing';
import Contact from '@/pages/frontend/memberCenter/Contact';
import MyBookHistory from '@/pages/frontend/memberCenter/MyBookHistory';
import BookStore from '@/pages/frontend/BookStore';
import BookStoreDetail from '@/pages/frontend/BookStoreDetail';
import BookStoreDetailDate from '@/pages/frontend/BookStoreDetailDate';
import BookStoreDetailTime from '@/pages/frontend/BookStoreDetailTime';
import { DialogProvider } from '@/context/DialogContext';
import GameHistory from '@/pages/frontend/memberCenter/GameHistory';
import Notifications from '@/pages/frontend/memberCenter/Notifications';

const FrontendRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <DialogProvider>
        <FrontendLayout />
      </DialogProvider>
    ),
    children: [
      { path: 'login', element: <FLogin /> },
      { path: 'register', element: <Register /> },
      { path: 'main', element: <FMain /> },
      { path: 'store', element: <Store /> },
      { path: 'storeDetail/:storeId', element: <StoreDetail /> },
      { path: 'deposit', element: <Deposit /> },
      { path: 'news', element: <News /> },
      { path: 'news/:newsUid', element: <NewsDetail /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <Faq /> },
      { path: 'policy', element: <Policy /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'restPwd', element: <RestPwd /> },
      { path: 'payment', element: <Payment /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: 'reservation', element: <Reservation /> },
      { path: 'book-store', element: <BookStore /> },
      { path: 'book-store-detail/:storeId', element: <BookStoreDetail /> },
      {
        path: 'book-store-detail-date/:storeId/:sId/:tableId/:tableUid',
        element: <BookStoreDetailDate />,
      },
      {
        path: 'book-store-detail-time/:storeId/:sId/:tableId/:tableUid/:sdate',
        element: <BookStoreDetailTime />,
      },

      {
        path: 'member-center',
        element: <MemberCenter />,
        children: [
          { path: '', element: <Navigate to="profile-edit" /> },
          { path: 'transaction-history', element: <TransactionHistory /> },
          { path: 'deposit-history', element: <DepositHistory /> },
          { path: 'profile-edit', element: <ProfileEdit /> },
          { path: 'game-ongoing', element: <GameOngoing /> },
          { path: 'game-history', element: <GameHistory /> },
          { path: 'my-book-history', element: <MyBookHistory /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'contact', element: <Contact /> },
        ],
      },
      { path: 'notfound', element: <NotFound /> },
      { path: '', element: <Navigate to="main" /> },
    ],
  },
];

const GlobalRoutes: FC = () => {
  const routes = [
    ...FrontendRoutes,
    { path: '*', element: <Navigate to="/notfound" /> },
  ];

  return (
    <>
      <LoadingProvider>{useRoutes(routes)}</LoadingProvider>
    </>
  );
};
export default GlobalRoutes;
