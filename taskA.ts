import axios from 'axios';

export interface TaskAInputs {
    url: string;
    anotherParam: string;  // Add any additional parameters needed by Task A
}

export interface TaskAOutputs {
    dataA: any;
}

export const code = async (inputs: TaskAInputs): Promise<TaskAOutputs> => {
    try {
        const response = await axios.get(inputs.url);
        console.log('Task A received data:', response.data);
        return { dataA: response.data };
    } catch (error) {
        console.error('Task A encountered an error:', error);
        throw error;
    }
};
