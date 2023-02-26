import { AlertSeverity } from '../../types/alerts';

export type GroupId = number;

interface IGroup {
  id: GroupId
  name: string
}

type IGroups = IGroup[];

export interface IGroupsResponseBody {
  total: number
  groups: IGroups
}

export interface IPlayersPerDayResponseBody {
  countActive: number
  countActivePrevious: number
  countNew: number
  countNewPrevious: number
}

export interface ICurrentActivesResponseBody {
  countExisting: number
  countNew: number
}

export interface IActiveSessionsBreakdownResponseBody {
  countObserving: number
  countQueuing: number
  countBetBehind: number
  countInPlay: number
  countReBuy: number
}

interface ILastMonthActiveAndNewPlayersStatsItem {
  date: string
  countActive: number
  countNew: number
}

export interface IWaitTimeResponseBody {
  averageWaitTimeCurrent: number
  averageWaitTime24: number
  averageWaitTime24Previous: number
}

export interface IMachinesAvailabilityResponseBody {
  countInPlay: number
  countReady: number
}

export interface IMachinesStatusResponseBody {
  countError: number
  countOffline: number
  countShuttingDown: number
  countDrying: number
  countPreparing: number
  countInPlay: number
  countSeeding: number
  countReady: number
}
export interface IAlert {
  date: string
  alert: string
  type: string
  severity: AlertSeverity
}

type IAlerts = IAlert[];

export interface ILatestAlertsResponseBody {
  alerts: IAlerts
}

type ILastMonthActiveAndNewPlayersStats = ILastMonthActiveAndNewPlayersStatsItem[];

export interface IActiveAndNewPlayersResponseBody {
  stats: ILastMonthActiveAndNewPlayersStats
}

interface IBettingActivityItem {
  date: string
  rounds: number
  bets: number
  wins: number
}

type IBettingActivityData = IBettingActivityItem[];

export interface IBettingActivityResponseBody {
  bets: IBettingActivityData
}

interface ITopWinnersAndLosersPlayer {
  player: string
  playerCid: string
  win: number
  loss: number
  online: boolean
}

type IWinners = ITopWinnersAndLosersPlayer[];

type ILosers = ITopWinnersAndLosersPlayer[];

export interface ITopWinnersAndLosersResponseBody {
  winners: IWinners
  losers: ILosers
}

interface IDashboardBasicItemState {
  isLoading: boolean
}

export interface IDashboardRequestGroupIdFilterParams {
  groupId: GroupId[]
}

interface IPlayersPerDay extends IPlayersPerDayResponseBody, IDashboardBasicItemState {}

interface ICurrentActivesState extends ICurrentActivesResponseBody, IDashboardBasicItemState {}

interface IActiveSessionsBreakdown extends IActiveSessionsBreakdownResponseBody, IDashboardBasicItemState {}

interface IActiveAndNewPlayers extends IActiveAndNewPlayersResponseBody, IDashboardBasicItemState {}

interface IBettingActivity extends IBettingActivityResponseBody, IDashboardBasicItemState {}

interface ITopWinnersAndLosers extends ITopWinnersAndLosersResponseBody, IDashboardBasicItemState {}

interface IActiveAndNewPlayers extends IActiveAndNewPlayersResponseBody, IDashboardBasicItemState {}

interface IBettingActivity extends IBettingActivityResponseBody, IDashboardBasicItemState {}

interface IWaitTime extends IWaitTimeResponseBody, IDashboardBasicItemState {
  filterValues?: IDashboardRequestGroupIdFilterParams
}

interface IMachinesAvailability extends IMachinesAvailabilityResponseBody, IDashboardBasicItemState {
  filterValues?: IDashboardRequestGroupIdFilterParams
}

interface IMachinesStatus extends IMachinesStatusResponseBody, IDashboardBasicItemState {
  filterValues?: IDashboardRequestGroupIdFilterParams
}

interface ILatestAlerts extends ILatestAlertsResponseBody, IDashboardBasicItemState {}

export enum CurrentActivesColor {
  existing = '#32c5ff',
  new = '#e02020',
}

export enum CurrentActivesLabel {
  existing = 'Existing',
  new = 'New',
}

export enum MachinesStatusColor {
  error = '#e02020',
  offline = '#d8d8d8',
  shuttingDown = '#474749',
  drying = '#fa6400',
  preparing = '#32c5ff',
  inPlay = '#6DD400',
  seeding = '#F7B500',
  ready = '#0091ff',
}

export enum MachinesStatusLabel {
  error = 'Error',
  offline = 'Offline',
  shuttingDown = 'Shutting Down',
  drying = 'Drying',
  preparing = 'Preparing',
  inPlay = 'In Play',
  seeding = 'Seeding',
  ready = 'Ready',
}

export interface IMachinesStatusChartItem {
  name: MachinesStatusLabel
  color: MachinesStatusColor
  value: number
}

export type IMachinesStatusChartData = IMachinesStatusChartItem[];

export interface ICurrentActivesChartItem {
  name: CurrentActivesLabel
  color: CurrentActivesColor
  value: number
}

export type ICurrentActivesChartData = ICurrentActivesChartItem[];

export enum ActiveSessionsBreakdownColor {
  reBuy = '#737374',
  observing = '#32c5ff',
  queuing = '#e02020',
  betBehind = '#f7b500',
  inPlay = '#07af08',
}

export enum ActiveSessionsBreakdownLabel {
  observing = 'Observing',
  queuing = 'Queuing',
  betBehind = 'Bet Behind',
  inPlay = 'In Play',
  reBuy = 'ReBuy',
}

export enum ActiveAndNewPlayersLabel {
  active = 'Active',
  new = 'New',
}

export enum ActiveAndNewPlayersColor {
  active = '#32c5ff',
  new = '#e02020',
}

export enum BettingActivityLabel {
  rounds = 'Rounds',
  bets = 'Bets',
  wins = 'Wins',
}

export enum BettingActivityColor {
  rounds = '#07af08',
  bets = '#f7b500',
  wins = '#32c5ff',
}

export interface IActiveSessionsBreakdownChartItem {
  name: ActiveSessionsBreakdownLabel
  color: ActiveSessionsBreakdownColor
  value: number
}

export type IActiveSessionsBreakdownChartData = IActiveSessionsBreakdownChartItem[];

export interface IDashboardReducer {
  readonly playersPerDay: IPlayersPerDay
  readonly currentActives: ICurrentActivesState
  readonly activeSessionsBreakdown: IActiveSessionsBreakdown
  readonly activeAndNewPlayers: IActiveAndNewPlayers
  readonly bettingActivity: IBettingActivity
  readonly topWinnersAndLosers: ITopWinnersAndLosers
  readonly waitTime: IWaitTime
  readonly machineAvailability: IMachinesAvailability
  readonly machinesStatus: IMachinesStatus
  readonly latestAlerts: ILatestAlerts
}

export interface IDashboardSlice {
  dashboardReducer: IDashboardReducer
}
