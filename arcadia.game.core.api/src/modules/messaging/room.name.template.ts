export function getRobotDirectRoom(machineSerial: string, sessionId: string): string {
  return `robot_${machineSerial}__p_${sessionId}`;
}

export function getRobotQueueRoom(machineSerial: string): string {
  return `robot-queue-${machineSerial}`;
}

export function sessionRoomNameFactory(sessionId: number | string): string {
  return `session-${sessionId}-direct-room`;
}
