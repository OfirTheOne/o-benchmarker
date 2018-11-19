import { forEachBenchmarkerTask } from './for-each';
import { forBenchmarkerTask} from './for';

import {BenchmarkerMeasureGroup} from '../../../lib'

export const ForMeasureGroup: BenchmarkerMeasureGroup = {
    groupDescription: 'For / ForEach method',
    tasks: [
        forEachBenchmarkerTask,
        forBenchmarkerTask,
    ]
}

