import * as moment from 'moment';
import { EventLog } from '../modules/schemas';
import { EventType } from '../modules/coreClient/enum';

function trimUntilPush(events: EventLog[]): EventLog[] {
  if (events.findIndex(e => e.type === EventType.CHIP_ADDED) === -1) {
    return events;
  }
  while (events[0].type !== EventType.CHIP_ADDED) {
    events.shift();
  }

  return events;
}

export function groupPushDropByRfid(dropEvents: EventLog[], pushEvents: EventLog[]): { rfid: string; pushedAt: number; droppedAt: number; serial: string; }[] {
  const events = [...dropEvents, ...pushEvents].sort((a, b) => moment(a.createdDate).diff(b.createdDate));
  const groupedEvents = [];
  while (true) {
    if (events.findIndex(e => e.type === EventType.CHIP_ADDED) === -1) {
      break;
    }
    trimUntilPush(events);
    const push = events[0];
    let drop;
    events.every((event, index) => {
      if (index < 1) return true;

      if (event.type === EventType.CHIP_DROP && event.parameters.rfid === push.parameters.rfid) {
        drop = event;
        groupedEvents.push({
          rfid: push.parameters.rfid, pushedAt: push.createdDate, droppedAt: event.createdDate, serial: push.parameters.machineSerial,
        });
        events.shift();
        return false;
      }
      return true;
    });
    events.shift(); // Removing push event
    if (drop) {
      events.splice(events.indexOf(drop), 1);
    }
  }

  return groupedEvents;
}