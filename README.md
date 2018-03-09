# Secure Scheduler

Secure scheduler is an easy to use module for scheduling events via end-user input using sandboxed method execution.

As such, the filesystem is not exposed in the event of a vulnerability. Hence, users can safely execute JavaScript code in Jobs.

## Installation
Install with `npm i secure-scheduler`

## Usage
Create a new scheduler as follows
```
const Scheduler = require('secure-scheduler');
const scheduler = new Scheduler();
```

Functions can then be queued by passing a Function and Date to the Scheduler.add method
```
scheduler.add(
  () => {
    // Do stuff
  },
  new Date(2018, 06, 05)
);
// returns Job { method: . . ., date: Date, id: "job_id" }
```

Scheduler.add returns an _id_ (UUID-V1 formatted) to refer to the Job.

Jobs/scheduled events can be cancelled by calling Scheduler.cancel with the job id
`scheduler.cancel("[JOB ID]")`

Job IDs can be retrieved as an array with Scheduler.jobs
`scheduler.jobs // [id, id, . . .]`