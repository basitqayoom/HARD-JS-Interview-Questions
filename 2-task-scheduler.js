class Scheduler {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.runningTasks = 0;
    this.queue = [];
  }

  // run the next task in the queue
  runNextTask() {
    if (this.runningTasks < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      task();
    }
  }

  addTask(task) {
    return new Promise((res, rej) => {
      async function __taskRunner() {
        this.runningTasks++;
        try {
          const result = await task();
          res(result);
        } catch (error) {
          console.error(error);
          rej(error);
        } finally {
          this.runningTasks--;
          // if there are more tasks in the queue, run them
          this.runNextTask();
        }
      }

      if (this.runningTasks < this.concurrency) {
        __taskRunner.call(this);
      } else {
        this.queue.push(__taskRunner.bind(this));
      }
    });
  }
}

const scheduler = new Scheduler(10);

// scheduler.addTask(
//   ()=> new Promise((res, rej)=>setTimeout(()=>res('Task 1'), 5*1000))
// )
// scheduler.addTask(
//   ()=> new Promise((res, rej)=>setTimeout(()=>res('Task 2'), 5*1000))
// )
// scheduler.addTask(
//   ()=> new Promise((res, rej)=>setTimeout(()=>res('Task 3'), 5*1000))
// )
// scheduler.addTask(
//   ()=> new Promise((res, rej)=>setTimeout(()=>res('Task 4'), 5*1000))
// )

async function saveToDb(message) {
  return new Promise((res, rej) =>
    setTimeout(() => {
      console.log(`Message ${message} saved to db`);
      res();
    }, 2 * 1000)
  );
}

function chat() {
  const messages = Array(100).fill(null);

  messages.forEach((_, index) => {
    const message = `Message ${index}`;
    scheduler.addTask(()=>saveToDb(message));
  });
}

chat();