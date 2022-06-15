import React from 'react';
import { flexTokenStore } from '../store/flex-token-store';
import { reservationsStore, Task } from '../store/reservations-store';
import { tinyStore } from '../store/tiny-store';
import { Reservation, Supervisor, Worker } from './taskrouter-for-reactnative/index.window';

//
// Types
//
export enum ReservationActions {
  accept = 'accept',
  reject = 'reject',
  complete = 'complete',
}

enum AddOrRemove {
  addListener = 'addListener',
  removeListener = 'removeListener',
}

//
// Helpers
//
export const isReservationPending = (task: any) => task && task.reservationStatus === 'pending';
export const isReservationWrapping = (task: any) => task && task.reservationStatus === 'wrapping';

const ACTIVITY_WHEN_ONLINE = 'Available on Mobile';
//
// Main Class
//
class TaskRouter {
  private worker!: Worker;
  setTaskRouterHasStarted!: React.Dispatch<React.SetStateAction<boolean>>;
  private startConversations!: Function;

  constructor() {}

  //
  // Public Functions
  //
  public startOrRefresh = (setTaskRouterHasStarted: React.Dispatch<React.SetStateAction<boolean>>, startConversations: Function) => {
    this.setTaskRouterHasStarted = setTaskRouterHasStarted;
    this.startConversations = startConversations;

    this.worker && this.hardReset(false);
    this.worker = new Worker(flexTokenStore.token, {});
    this.addRemoveListeners(AddOrRemove.addListener);
  };

  public async toggleWorkerActivity(available: boolean) {
    const activityName = available ? ACTIVITY_WHEN_ONLINE : 'Offline';
    const optionsWhenMovingToOffline = available ? {} : { rejectPendingReservations: true };

    this.worker.activities.forEach((act: any) => {
      if (act.name === activityName && !act.isCurrent) {
        console.log('New activity: ', act.name, act.isCurrent, act.sid);
        act.setAsCurrent(optionsWhenMovingToOffline);
      }
    });
  }

  public async reservationAction(reservationSid: string, action: ReservationActions) {
    await (this.worker.reservations.get(reservationSid) as any)[action]();
  }

  //
  // Private Functions
  //
  private async setPushToken() {
    const pushToken = tinyStore.pushToken;
    const a = this.worker.attributes as any;
    console.log('@@setPushToken', pushToken, a.pushToken, a);

    if (!pushToken || a.pushToken === pushToken) {
      console.log('@@setPushToken aborting.');
      return;
    }

    a.pushToken = pushToken;
    await this.worker.setAttributes(a);
  }

  private loadInitialtasks = async () => {
    console.log('@@loadInitialtasks');
    const { reservations } = this.worker;
    reservations.forEach((reservation: Reservation) => {
      this.loadTask(reservation);
    });
  };

  private loadTask = async (reservation: Reservation, event: string = '') => {
    const {
      sid: reservationSid,
      status: reservationStatus,
      task: { attributes, sid, workflowName, queueName, status, age, priority },
    } = reservation;

    const task: Task = {
      isVoice: !!(attributes as any).call_sid,
      reservationSid,
      reservationStatus,
      attributes,
      sid,
      workflowName,
      queueName,
      status,
      priority,
      timeAgo: age,
    };

    //
    // Delete
    //
    if (['rejected', 'timeout'].includes(event) || ['canceled', 'completed'].includes(status)) {
      reservationsStore.del(reservationSid);
      this.worker.reservations.get(reservationSid)?.task.removeAllListeners();
      this.worker.reservations.get(reservationSid)?.removeAllListeners();

      if (task.isVoice) {
        reservationsStore.currentVoiceSid = '';
      }

      // TODO: Remove Chat
      // if (attributes && (attributes as any).conversationSid) {
      // TEMPOFF cleanupChat((attributes as any).conversationSid);
      return;
    }

    //
    // Add
    //
    if (!reservationsStore.exists(reservationSid)) {
      this.addListeners(reservationSid);
    }

    //
    // Add/Update
    //
    console.log('@@ taskrouter store add task: ', task);
    reservationsStore.add(task);

    if (task.isVoice) {
      reservationsStore.currentVoiceSid = task.reservationSid;
    }
  };

  private hardReset = (alsoCleanToken: boolean) => {
    console.log('@@ cleaning the token...');
    this.worker.disconnect();
    this.addRemoveListeners(AddOrRemove.removeListener);
    if (alsoCleanToken) {
      flexTokenStore.set('');
    }
  };

  private dispatchWorkerActivity = () => {
    const isAvailable = this.worker.activity.name === ACTIVITY_WHEN_ONLINE;
    tinyStore.isAvailable = isAvailable;
    console.log('@@ isAvailable', isAvailable, this.worker.activity.name);
  };

  //
  // Listeners
  //
  private addListeners = async (reservationSid: string) => {
    const reservationEvents = ['accepted', 'rejected', 'timeout', 'canceled', 'rescinded', 'completed', 'wrapup'];

    const reservation = this.worker.reservations.get(reservationSid);

    reservationEvents.forEach((event: string) => {
      reservation?.addListener(event, (a: any) => {
        console.log('@@ reservation event', event);
        this.loadTask(reservation, event);
      });
    });

    const taskEvents = ['updated', 'wrapup', 'completed', 'canceled'];

    taskEvents.forEach((event: string) => {
      reservation?.task.addListener(event, (a: any) => {
        console.log('@@@@ task event', event, a);
        this.loadTask(reservation, event);
      });
    });
  };

  private onError = async (error: any) => {
    console.log('@@ taskrouter.on.error', error);

    if (
      error &&
      error.payload &&
      error.payload.message &&
      (error.payload.message.includes('403 Invalid Access Token') || error.payload.message.includes('403 Access Token expired'))
    ) {
      this.hardReset(true);
    } //
  };

  private onReady = async (worker: Supervisor) => {
    console.log('@@ ready!');

    this.dispatchWorkerActivity();
    await this.toggleWorkerActivity(tinyStore.isAvailable);

    await this.setPushToken();
    await this.loadInitialtasks();
    await this.startConversations();
    this.setTaskRouterHasStarted(true);
  };

  private onReservationCreated = async (event: any) => {
    await this.loadTask(event);
  };

  private onActivityUpdated = async (event: any) => {
    this.dispatchWorkerActivity();
  };

  private onJustLogForNow = (event: string) => (a: any) => console.log(`@@ taskrouter.on.${event}`, a);

  addRemoveListeners = (addOrRemove: AddOrRemove) => {
    this.worker[addOrRemove]('tokenExpired', this.onJustLogForNow('tokenExpired'));
    this.worker[addOrRemove]('tokenUpdated', () => this.onJustLogForNow('tokenUpdated'));
    this.worker[addOrRemove]('attributesUpdated', this.onJustLogForNow('attributesUpdated'));

    this.worker[addOrRemove]('activityUpdated', this.onActivityUpdated);
    this.worker[addOrRemove]('reservationCreated', this.onReservationCreated);
    this.worker[addOrRemove]('error', this.onError);
    this.worker[addOrRemove]('ready', this.onReady);
  };
}

export const taskrouterSdk = new TaskRouter();
