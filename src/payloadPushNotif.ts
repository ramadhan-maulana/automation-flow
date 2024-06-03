interface AbsentEmployee {
    user_id: number;
    employee_id: string;
    full_name: string;
    date: string;
}

export interface Payload {
    type: string;
    title: string;
    message: string;
    sender_id: number;
    receiver_id: number;
    notifications: boolean;
    description: string;
}

export interface PayloadPushNotifInputs {
    emailPayload: string;
    absentPayload: AbsentEmployee[];
}

export const code = async (inputs: PayloadPushNotifInputs) => {
    try {
        let emailPayload = inputs.emailPayload;
        let absentPayload = inputs.absentPayload;
    
        const createBody = (absentPayload: AbsentEmployee[], emailPayload: string) => {
            // Define an object to store the resulting payloads
            const payloads: { [key: number]: Payload } = {};
    
            // Loop through each absent employee
            for (const employee of absentPayload) {
                // Extract necessary information
                const receiverId = employee.user_id;
                const name = employee.full_name;
                // let result = emailPayload.replace('${name}', name);
                let result = "x";
                // Construct the payload for this employee
                const payload: Payload = {
                    type: "general",
                    title: "Absent Employee", // You can customize this
                    message: "Absent Employee", // You can customize this
                    sender_id: -1, // Assuming sender ID is always -1
                    receiver_id: receiverId,
                    notifications: true,
                    description: `${result}` // Assuming description comes from email payload
                };
    
                // Assign the payload to the receiverId key in the payloads object
                payloads[receiverId] = payload;
            }
            return payloads;
        };
    
        const payloads = { notifications_payload: createBody(absentPayload, emailPayload) };
        return payloads;
    } catch (error) {
        console.error('PayloadPushNotif encountered an error:', error);
        throw error;
    }
};
