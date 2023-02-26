export enum NotificationType {
  insufficientFunds = 'insufficientFunds',
  betFailed = 'betFailed',
  payoutFailed = 'payoutFailed',
  roundLimitReached = 'roundLimitReached',
  restoreConnectionFailed = 'restoreConnectionFailed',
  loginFailed = 'loginFailed'
}

interface IInsufficientFundsData {
  canBuy: number;
}

export interface IBaseNotification<TNotificationType, TData = undefined> {
  notificationId: TNotificationType;
  title: string;
  message: string;
  data: TData;
}

interface IInsufficientFunds extends IBaseNotification<NotificationType.insufficientFunds, IInsufficientFundsData>{}

interface IBetFailed extends IBaseNotification<NotificationType.betFailed>{}

interface IPayoutFailed extends IBaseNotification<NotificationType.payoutFailed>{}

interface IRoundLimitReached extends IBaseNotification<NotificationType.roundLimitReached>{}

interface IRestoreConnectionFailed extends IBaseNotification<NotificationType.restoreConnectionFailed>{}

interface ILoginFailed extends IBaseNotification<NotificationType.loginFailed>{}

export type INotification = IInsufficientFunds | IBetFailed | IPayoutFailed | IRoundLimitReached | IRestoreConnectionFailed | ILoginFailed;
