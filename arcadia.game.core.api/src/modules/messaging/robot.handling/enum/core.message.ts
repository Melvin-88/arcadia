export enum CoreMessage {
  ENGAGE = 'engage',
  ALLOW_DISPENSING = 'allow',
  BLOCK_DISPENSING = 'block',
  BREAKUP = 'breakup',
  STOP = 'stop',
  RUN = 'run',
  PUSH = 'push',
  AUTO = 'auto',
  STOP_AUTO = 'stopauto',
  CHIP_VALIDATION = 'chipvalidation',
  CHIP_MAP = 'chipmap',
  TABLE = 'table',
  VALIDATE_SESSION = 'validatesession', // not in docs
  RESHUFFLE = 'reshuffle',
  SEED = 'seed',
  REBOOT = 'reboot',
}
