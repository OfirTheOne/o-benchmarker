import { IBenchmarkEngine } from './models'
import { PromiseBaseBenchmarkEngine } from './engine';
import { BenchmarkerTasksGroup, BenchmarkerTasksGroupReport } from './../../models';
import { BenchmarkerFlags, IBenchmarkerFlags } from './../../models/internal'
import { StringifyBenchmarkerObjects as SBO } from '../format/format-benchmark-report';
import { Queue } from '../utils/queue';

export class Benchmarker {

    private engine: Readonly<IBenchmarkEngine>;
    private flags: BenchmarkerFlags;

    constructor(flags?: IBenchmarkerFlags) {
        this.flags = new BenchmarkerFlags(flags);
        this.engine = Object.freeze(new PromiseBaseBenchmarkEngine());
    }

    // #region - public
    public echo(tasksGroups: BenchmarkerTasksGroup[]): void {
        this.process(tasksGroups, (res) => {
            this.writeResult(res);
        });
    }
    public getEngine() {
        return this.engine;
    }
    // #endregion
    
    private writeResult(groupReport: BenchmarkerTasksGroupReport) {
        if(this.flags.printas == 'json') {
            console.log(
                SBO.groupReportsAsJson(groupReport, { machineInfo: this.flags.minfo })
            );
        } else {
            console.log(
                SBO.formatGroupReports(groupReport, { machineInfo: this.flags.minfo })
            );
        }
        console.log("\x1b[0m"); // reset console style
    }
    private process(tasksGroups: BenchmarkerTasksGroup[], handler:(res: BenchmarkerTasksGroupReport)=>void) {
        if (!tasksGroups) { return; }
        const groupsQueue = new Queue<BenchmarkerTasksGroup>(tasksGroups);
        let tasksGroup = groupsQueue.poll();

        this.engine.on(this.engine.events.success, (groupReport: BenchmarkerTasksGroupReport) => {
            handler(groupReport)
 
            tasksGroup = groupsQueue.poll();
            tasksGroup ? this.engine.measureGroup(tasksGroup) : 0;
        });
        this.engine.on(this.engine.events.error, (error) => {
            console.log(error);
            this.engine.cleanupListeners();
        })
        
        tasksGroup ? this.engine.measureGroup(tasksGroup) : 0;
    }
}
