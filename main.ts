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

  onUpdate(callback: Function) {
    this.observer.subscribe('print', callback);
    this.observer.subscribe('printError', callback);

    return () => {
      this.observer.unsubscribe('print', callback);
      this.observer.unsubscribe('printError', callback);
    };
  }
}

const printer = new Printer(new Observer());

// * Define the listener
const printerListener = (data: EventData) => {
  console.log('PRINTER LISTENER :', data);
};

// * Subscribe the listener
const unsubscribeFunction = printer.onUpdate(printerListener);

// * The listeners will be called
printer.print('Hello World 1');
printer.print('Hello World 2');
printer.printError('Error 1');

unsubscribeFunction();

// * The listeners will not be called
printer.print('Hello World 3');
printer.printError('Error 2');
