export interface SetupConfigInputs {
    
}

export const code = async (inputs: SetupConfigInputs) => {
    try {
        const data = {
            "scheduler_type": "weekly",
            "credential": {
              "client_id": "lMNugo1ldBpQ2yzu",
              "client_secret": "Xeqjw12p2d70GY9dW0Vt4gUy6evH0kTt"
            }
          }
        console.log('setupConfig data:', data);
        return data ;
    } catch (error) {
        console.error('SetupConfig encountered an error:', error);
        throw error;
    }
};
