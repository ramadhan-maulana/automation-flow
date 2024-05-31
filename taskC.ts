export interface TaskCInputs {
    dataB: string;
    anotherParam: string;  // If needed, carry forward or add additional parameters for Task C
}

export interface TaskCOutputs {
    dataC: string;
}

export const code = async (inputs: TaskCInputs): Promise<TaskCOutputs> => {
    console.log('Task C received:', inputs.dataB);
    // Simulate further processing the data
    const finalData = `Task C processed data: ${inputs.dataB.toLowerCase()}`;
    return { dataC: finalData };
};
