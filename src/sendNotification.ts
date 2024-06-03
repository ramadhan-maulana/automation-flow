import axios from 'axios';
import crypto_js from 'crypto-js';
import { Payload } from './payloadPushNotif';

export interface SendNotificationInputs {
    payload: Payload[];
    email_payload: string;
    client_id: string;
    client_secret: string;
}

export const code = async (inputs: SendNotificationInputs) => {
    try {
        const payloads = inputs.payload; // Assuming inputs is provided
        const email_payload = inputs.email_payload; // Assuming inputs is provided
        const url = `https://api.mekari.com/v2/talenta/v2/notification`;

        function generateHmacHeader() {
            const client_id = inputs.client_id;
            const client_secret = inputs.client_secret;
            const method = 'POST';
            const path = `/v2/talenta/v2/notification`;
            const date = new Date().toUTCString();
            const requestLine = method + ' ' + path + ' HTTP/1.1';
            const payload = ['date: ' + date, requestLine].join("\n");
            const digest = crypto_js.HmacSHA256(payload, client_secret);
            const signature = crypto_js.enc.Base64.stringify(digest);
            const authorizationHeader = 'hmac username="' + client_id + '", algorithm="hmac-sha256", headers="date request-line", signature="' + signature + '"';

            return {
                'Content-Type': 'application/json',
                'Date': date,
                'Authorization': authorizationHeader
            };
        }

        const sendNotifications = async (payloads: Payload[], email_payload: string, url: string) => {
            const results: any[] = []; // Array to store notification results

            for (const payload of payloads) {
                const headers = generateHmacHeader();
                try {
                    const receiverId = payload.receiver_id;

                    payload.description = email_payload;

                    // Send notification to the current employee
                    const response = await axios.post(url, payload, { headers });
                    const response_data = { message: response.data, status: response.status };
                    results.push({ receiver_id: receiverId, success: true, response_data });
                } catch (error) {
                    // Handle individual notification errors
                    const errorResponse = (error as any).response ? {
                        status: (error as any).response.status,
                        data: (error as any).response.data
                    } : {
                        message: (error as any).message
                    };

                    let errorResult = { receiver_id: payload.receiver_id, success: false, error: errorResponse };
                    results.push(errorResult);
                }
            }
            return results; // Return results after sending all notifications
        };

        try {
            // Wait for the notifications to be sent
            const notificationResults = await sendNotifications(payloads, email_payload, url);
            
            // Check if all notifications were successful
            const allSuccess = notificationResults.every(result => result.success);
            
            if (allSuccess) {
                return 'all ok';
            } else {
                // Filter out and return the failed notifications
                const failedNotifications = notificationResults.filter(result => !result.success);
                return failedNotifications;
            }
        } catch (error) {
            throw error;
        }
    } catch (error) {
        console.error('SendNotification encountered an error:', error);
        throw error;
    }
};
