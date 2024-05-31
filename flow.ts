import { code as taskA, TaskAInputs, TaskAOutputs} from './taskA';
import { code as taskB, TaskBInputs, TaskBOutputs } from './taskB';
import { code as taskC, TaskCInputs, TaskCOutputs } from './taskC';

async function executeFlow() {
    try {
        // Ensure initialInputs contains a URL for taskA
        const initialInputs: TaskAInputs = { url: 'https://jsonplaceholder.typicode.com/todos/1', anotherParam: 'example' };
        const resultA: TaskAOutputs = await taskA(initialInputs);

        const resultBInputs: TaskBInputs = { ...initialInputs, ...resultA };
        const resultB: TaskBOutputs = await taskB(resultBInputs);

        const resultCInputs: TaskCInputs = { ...initialInputs, ...resultB };
        const resultC: TaskCOutputs = await taskC(resultCInputs);

        console.log('Final output:', resultC);
    } catch (error) {
        console.error('Error in flow execution:', error);
    }
}

// Execute the flow with initial inputs
executeFlow();

