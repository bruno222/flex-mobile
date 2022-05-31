import { store } from '@risingstack/react-easy-state';

export interface Task {
  reservationSid: string;
  reservationStatus: string;
  attributes: any;
  sid: string;
  workflowName: string;
  queueName: string;
  status: 'pending' | 'reserved' | 'assigned' | 'canceled' | 'completed' | 'wrapping';
  priority: number;
  timeAgo: number;
}

interface Reservations {
  [key: string]: Task;
}

export const reservationsStore = store({
  all: {} as Reservations,
  add(task: Task) {
    reservationsStore.all[task.reservationSid] = task;
  },
  del(reservationSid: string) {
    delete reservationsStore.all[reservationSid];
  },
  get(reservationSid: string) {
    return reservationsStore.all[reservationSid];
  },
  exists(reservationSid: string) {
    return !!reservationsStore.all[reservationSid];
  },
  length() {
    return Object.values(reservationsStore.all).length;
  },
});
