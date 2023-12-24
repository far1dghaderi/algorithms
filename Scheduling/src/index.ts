const MIN_TASK_DURATION = 10;
const MAX_TASK_DURATION = 20;
const WORKERS_COUNT = 2;


type Task = [string,number]; 
type _Worker = Record<string,{tasks:[Task],fulffiledCount:number}>;
const WorkerFullfiledTasks = []

class Scheduler{

    constructor(private workersCount:number) { }

    runTasks(tasks:Task[]){
        tasks = this._sortTasks(tasks);
        const workers = this._setupWorkers();

        while(tasks.length){
            for(const workerKey in workers){
                if(workers[workerKey].fulffiledCount !==0)
                {
                    let task = tasks.shift();
                    if(task)
                    {
                        workers[workerKey].tasks.push(task);
                        workers[workerKey].fulffiledCount += task[1];
                    }
                }else{
                    let task = tasks[0];

                    if(task){
                        let isWorkerAllowToStartNextTask = false;
                        let otherWorkersFullfiledTasks:[number] = [workers[workerKey].fulffiledCount];

                        for(const key in workers){
                            otherWorkersFullfiledTasks.push(workers[key].fulffiledCount); 
                        }

                        isWorkerAllowToStartNextTask = otherWorkersFullfiledTasks.every(count=>workers[workerKey].fulffiledCount <= count);

                        if(isWorkerAllowToStartNextTask){
                            workers[workerKey].tasks.push(task);
                            workers[workerKey].fulffiledCount += task[1];
                            tasks.shift();
                        }
                    }
                }
            }
        }
        let processTime = 0;
        for(const workerKey in workers){
            if(processTime<workers[workerKey].fulffiledCount)
            processTime = workers[workerKey].fulffiledCount;
        }

        console.log('process time:', processTime)
    }

    private _sortTasks(tasks:Task[]):Task[]{
        const sorted =  tasks.sort((a,b)=>a[1]-b[1]);
        console.log(sorted);
        return sorted;
    }

    private _setupWorkers():_Worker{
        const workers:_Worker = {};
        for(let i = 0;i<this.workersCount;i++){
            workers[`${i}`] = {tasks:[['bypass',0]],fulffiledCount:0};
            workers[`${i}`].tasks.shift();
        }

        return workers;
    }

}

class TaskManager{
     generateTasks(count:number):Task[]{
        let tasks:Task[] = [];

        for(let i =1;i<=count;i++){
            tasks.push([`P${i-1}`,this._generateRandomDuration()]);
        }
        
        return tasks;
    }

    private _generateRandomDuration():number{
        return Math.floor(
            Math.random() * (MAX_TASK_DURATION - MIN_TASK_DURATION + 1) + MIN_TASK_DURATION
          )
    }
}

const taskManager = new TaskManager();
const scheduler = new Scheduler(WORKERS_COUNT);
scheduler.runTasks(taskManager.generateTasks(6));
