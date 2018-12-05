import { forEachBenchmarkerTask } from './for-each';
import { forBenchmarkerTask} from './for';

import {BenchmarkerTasksGroup} from '../../../lib'

export const ForTasksGroup: BenchmarkerTasksGroup = {
    groupDescription: 'For / ForEach method',
    options: {
        equalArgs: false
    },
    tasks: [
        forEachBenchmarkerTask,
        forBenchmarkerTask,
    ]
}

