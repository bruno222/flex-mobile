import React from 'react';
import { SetterOrUpdater } from 'recoil';
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

//
// Main Class
//
class TaskRouter {
  private worker!: Worker;
  private token!: string;
  private setToken!: SetterOrUpdater<{}>;
  private setTasks!: SetterOrUpdater<{}>;
  private setIsAvailable!: SetterOrUpdater<boolean>;
  setTaskRouterHasStarted!: React.Dispatch<React.SetStateAction<boolean>>;
  private startConversations!: Function;

  constructor() {}

  //
  // Public Functions
  //
  public startOrRefresh = (
    token: string,
    setToken: SetterOrUpdater<{}>,
    setTasks: SetterOrUpdater<{}>,
    setIsAvailable: SetterOrUpdater<boolean>,
    setTaskRouterHasStarted: React.Dispatch<React.SetStateAction<boolean>>,
    startConversations: Function
  ) => {
    this.token = token;
    this.setToken = setToken;
    this.setToken = setToken;
    this.setTasks = setTasks;
    this.setIsAvailable = setIsAvailable;
    this.setTaskRouterHasStarted = setTaskRouterHasStarted;
    this.startConversations = startConversations;

    this.worker && this.hardReset(false);
    this.worker = new Worker(token, {});
    this.addRemoveListeners(AddOrRemove.addListener);
  };

  public async toggleWorkerActivity(available: boolean) {
    const activityName = available ? 'Available' : 'Offline';
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

    console.log('@@loadTask', event, reservationSid, sid);

    const task = {
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

    this.setTasks((old: any) => {
      // Add listeners only once
      if (!old[reservationSid] || !old[reservationSid].addedListeners) {
        this.addListeners(reservationSid);
      }

      const newState = { ...old, [reservationSid]: { ...task, addedListeners: true } };

      // Remove Task from State
      console.log('@@@ new status: ', event, newState[reservationSid].status);
      if (
        newState[reservationSid] &&
        (['rejected', 'timeout'].includes(event) || ['canceled', 'completed'].includes(newState[reservationSid].status))
      ) {
        // Remove Chat
        if (attributes && (attributes as any).conversationSid) {
          // TEMPOFF cleanupChat((attributes as any).conversationSid);
        }

        this.worker.reservations.get(reservationSid)?.task.removeAllListeners();
        this.worker.reservations.get(reservationSid)?.removeAllListeners();
        delete newState[reservationSid];
      }

      // Render
      return newState;
    });
  };

  private hardReset = (alsoCleanToken: boolean) => {
    console.log('@@ clearning the token...');
    this.worker.disconnect();
    this.addRemoveListeners(AddOrRemove.removeListener);
    if (alsoCleanToken) {
      this.setToken('');
    }
  };

  private dispatchWorkerActivity = () => {
    const isAvailable = this.worker.activity.name === 'Available';
    // console.log('@@ isAvailable', isAvailable, this.worker.activity.name);
    this.setIsAvailable(isAvailable);
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
    await this.loadInitialtasks();
    await this.startConversations(this.token);
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
