// 前台路由
import { RouteRecordRaw } from 'vue-router';
import FrontLayout from '@/layouts/FrontLayout.vue';
import Home from '@/views/front/Home.vue';
import Login from '@/views/front/Login.vue';
import Register from '@/views/front/Register.vue';
import Divination from '@/views/front/Divination.vue';
import LightProduct from '@/views/front/LightProduct.vue';
import OfferingHall from '@/views/front/OfferingHall.vue';
import GodOffering from '@/views/front/GodOffering.vue';
import Blessing from '@/views/front/Blessing.vue';
import Master from '@/views/front/Master.vue';
import RestPwd from '@/views/front/RestPwd.vue';
import Store from '@/views/front/Store.vue';
import NotFound from '@/views/front/NotFound.vue';
import MemberCenter from '@/views/front/MemberCenter/index.vue';
import MemberProfile from '@/views/front/MemberCenter/MemberProfile.vue';
import PurchaseHistory from '@/views/front/MemberCenter/PurchaseHistory.vue';
import MyBlessings from '@/views/front/MemberCenter/MyBlessings.vue';
import OrderHistory from '@/views/front/MemberCenter/OrderHistory.vue';
import ProductDetail from '@/views/front/ProductDetail.vue';
import Cart from '@/views/front/Cart.vue';
import Privacy from '@/views/front/Privacy.vue';
import Policy from '@/views/front/Policy.vue';
import PaymentCB from '@/views/front/PaymentCB.vue';
import PaymentCBMaster from '@/views/front/PaymentCBMaster.vue';
import PaymentCBLantern from '@/views/front/PaymentCBLantern.vue';
import PaymentCBOGod from '@/views/front/PaymentCBOGod.vue';
import PaymentCBOffering from '@/views/front/PaymentCBOffering.vue';
import MyLight from '@/views/front/MyLight.vue';
import OAuth2Redirect from '@/views/front/OAuth2Redirect.vue';
import CheckoutSuccess from '@/views/front/CheckoutSuccess.vue';
export const frontRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: FrontLayout,
    meta: { layout: 'default' },
    children: [
      { path: '', redirect: '/home' },
      {
        path: '/restPwd/:token',
        component: RestPwd,
      },
      { path: 'home', component: Home },
      { path: 'login', component: Login, name: 'Login' },
      { path: 'register', component: Register },
      {
        path: 'member-center',
        component: MemberCenter,
        meta: { requiresAuth: true },
        children: [
          { path: '', redirect: { name: 'MemberProfile' } },
          {
            path: 'memberProfile',
            name: 'MemberProfile',
            component: MemberProfile,
          },
          {
            path: 'purchaseHistory',
            name: 'PurchaseHistory',
            component: PurchaseHistory,
          },
          {
            path: 'myBlessings',
            name: 'MyBlessings',
            component: MyBlessings,
          },
          {
            path: 'orderHistory',
            name: 'OrderHistory',
            component: OrderHistory,
          },
        ],
      },
      { path: 'divination', component: Divination },
      { path: 'offeringHall', component: OfferingHall },
      { path: 'godOffering', component: GodOffering },
      { path: 'lightProduct', component: LightProduct },
      { path: 'blessing', component: Blessing },
      { path: 'master', component: Master },
      { path: 'store', component: Store, name: 'StoreProductList' },
      { path: 'store/:id', component: ProductDetail, name: 'ProductDetail' },
      { path: 'cart', component: Cart, name: 'Cart' },
      {
        path: 'checkout-success/:id',
        component: CheckoutSuccess,
        name: 'CheckoutSuccess',
      },
      { path: 'privacy', component: Privacy, name: 'Privacy' },
      { path: 'policy', component: Policy, name: 'Policy' },
      {
        path: '/paymentCB',
        component: PaymentCB,
      },
      {
        path: '/paymentCBMaster',
        component: PaymentCBMaster,
      },
      {
        path: '/paymentCBLantern',
        component: PaymentCBLantern,
      },
      {
        path: '/paymentCBOffering',
        component: PaymentCBOffering,
      },
      {
        path: '/paymentCBGod',
        component: PaymentCBOGod,
      },
      { path: 'myLight', component: MyLight, name: 'MyLight' },
      {
        path: '/oauth2/redirect',
        component: OAuth2Redirect,
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
      },
    ],
  },
];
