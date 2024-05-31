export interface TaskBInputs {
    dataA: any;
    anotherParam: string;  // If needed, carry forward or add additional parameters for Task B
}

export interface TaskBOutputs {
    dataB: string;
}

export const code = async (inputs: TaskBInputs): Promise<TaskBOutputs> => {
    console.log('Task B received:', inputs.dataA);
    // Simulate processing the data
    const processedData = `Task B processed data: ${JSON.stringify(inputs.dataA).toUpperCase()}`;
    return { dataB: processedData };
};
