import { lazy } from 'react';

export const Reporting = lazy(
  () => import('./components/reporting/Reporting')
);

export const IspHome = lazy(
  () => import('./components/IspHome/IspHome')
);

export const Header = lazy(
  () => import('./components/header/Header')
);

export const Home = lazy(
  () => import('./containers/HomeContainer')
);

export const Store = lazy(
  () => import('./components/store/Store')
);

export const Logout = lazy(
  () => import('./components/Logout/Logout')
);

export const Ordering = lazy(
  () => import('./components/ordering/OrderingHome')
);

export const OrderingDetail = lazy(
  () => import('./components/ordering/Landing/OrderingDetail/OrderingDetail')
);

export const ReviewFinalize = lazy(
  () => import('./components/ordering/Landing/ReviewFinalize/ReviewFinalize')
);

export const GuidedReplenishment = lazy(
  () => import('./components/ordering/Landing/GrRecap/GuidedReplinishment')
);

export const ReportingDetail = lazy(
  () => import('./components/reporting/ReportingDetail')
);

export const ReportingDetailMultiDay = lazy(
  () => import('./components/reporting/ReportingDetailMultiDay')
);

export const ReportingDetailNonDaily = lazy(
  () => import('./components/reporting/ReportingDetailNonDaily')
);

export const ReportingDetailGR = lazy(
  () => import('./components/reporting/ReportingDetailGR')
);

export const Message = lazy(
  () => import('./components/messages/message')
);

export const Launch = lazy(
  () => import('./components/launch/launch')
);

export const DsdOrderByVendor = lazy(
  () => import('./components/supportFunctions/DsdOrderByVendor/DsdOrderByVendor')
);

export const StoreOrderErrors = lazy(
  () => import('./components/supportFunctions/StoreOrderErrors/StoreOrderErrors')
);

export const TransmitDeliveryCalender = lazy(
  () => import('./components/supportFunctions/TransmitDeliveryCalender/TransmitDeliveryCalender')
);

export const DsdOrderDetails = lazy(
  () => import('./components/supportFunctions/DsdOrderByVendor/DsdOrderDetails')
);

export const MessageBox = lazy(
  () => import('./components/shared/MessageBox')
);


