type EventData = { event: string; data: any };

class Observer {
  private observers = new Map<string, Function[]>();
  // *  Holds the list of subscribers (listeners)

  constructor() {
    this.observers = new Map();
  }

  // * Subscribe a listener
  subscribe(eventName: string, fn: Function) {
    const subscribers = this.observers.get(eventName);

    if (subscribers) {
      subscribers.push(fn);
      this.observers.set(eventName, subscribers);
    } else {
      this.observers.set(eventName, [fn]);
    }
  }

  // * Unsubscribe a listener
  unsubscribe(eventName: string, fn: Function) {
    const subscribers = this.observers.get(eventName);

    if (subscribers) {
      const index = subscribers.indexOf(fn);
      subscribers.splice(index, 1);
      this.observers.set(eventName, subscribers);
    }
  }

  // * Broadcast the data to all the listeners
  broadcast(data: EventData) {
    const subscribers = this.observers.get(data.event);

    if (subscribers) {
      subscribers.forEach((fn) => fn(data));
    }
  }
}

class Printer {
  constructor(private observer: Observer) {}

  print(data: any) {
    console.log(data);
    this.observer.broadcast({ event: 'print', data });
  }

  printError(data: any) {
    console.error(data);
    this.observer.broadcast({ event: 'printError', data });
  }
}

const observer = new Observer();
const printer = new Printer(observer);

const printListener = function (data: EventData) {
  console.log(data);
};
const printErrorListener = function (data: EventData) {
  console.error(data);
};

// * Subscribe to the events
observer.subscribe('print', printListener);
observer.subscribe('printError', printErrorListener);

// * The listeners will be called
printer.print('Hello World 1');
printer.print('Hello World 2');
printer.printError('Error 1');

// * Unsubscribe from the events
observer.unsubscribe('print', printListener);
observer.unsubscribe('printError', printErrorListener);

// * The listeners will not be called
printer.print('Hello World 3');
printer.printError('Error 2');
