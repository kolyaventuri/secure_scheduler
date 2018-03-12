# Secure Scheduler

Secure scheduler is an easy to use module for scheduling events via end-user input using sandboxed method execution.

As such, the filesystem is not exposed in the event of a vulnerability. Hence, users can safely execute JavaScript code in Jobs.

## Installation
Install with `npm i secure-scheduler`

## Usage
Create a new scheduler as follows
```
const Scheduler = require('secure-scheduler');
const scheduler = new Scheduler('./jobs.json');
```

where the parameter is the storage path for jobs.

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

## Allowing access to Node.JS modules
Modules can be exposed using identical option parameters to [vm2](https://github.com/patriksimek/vm2).

They can be defined globally in the Scheduler constructor
```
const scheduler = new Scheduler('./jobs.json', {
    require: {
      builtin: ['path']
    }
})
```

Or they can be defined on Scheduler.add
```
scheduler.add(() => {
    return require('path').extname('index.html');
    },
    new Date(2018, 06, 05),
    {
      require: {
        builtin: ['path']
      }
    }
)
```

*vm2 options defined in Scheduler.add take precedent over globally defined options in the constructor*

**Take care in exposing modules**
Exposing the built in `fs` module can lead to irreparable harm to your filesystem should an end user be able to invoke it. Only expose what is needed for your module to function. If needed, stub your modules with vm2 mock syntax.