import { code as SetupConfig, SetupConfigInputs} from './setupConfig';
import { code as GetLastPage, GetLastPageInputs} from './getLastPage';
import { code as GetDate, GetDateInputs} from './getDate';
import { code as GetPage, GetPageInputs} from './getPage';
import { code as FetchAttendanceData, FetchAttendaceDataInputs} from './fetchAttendanceData';
import { code as FilterAbsentEmployee, FilterAbsentEmployeeInputs} from './filterAbsentEmployee';
import { code as TalentaPayload, TalentaPayloadInputs} from './talentaPayload';
import { Payload, code as PayloadPushNotif, PayloadPushNotifInputs} from './payloadPushNotif';
import { code as SendNotification, SendNotificationInputs} from './sendNotification';


function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

async function executeFlow() {
    interface absentEmployee{
        user_id: number;
        employee_id: string;
        full_name: string;
        date: string;
      }
    const storage = {
        attendanceData: [] as absentEmployee[]
    }
    try {
        const inputs: SetupConfigInputs = {};
        const setupConfig = await SetupConfig(inputs);

        const getLastPageInputs: GetLastPageInputs = { 
            client_id: setupConfig.credential.client_id, 
            client_secret: setupConfig.credential.client_secret 
        };
        const getLastPage = await GetLastPage(getLastPageInputs);
        
        const getDateInputs: GetDateInputs = { 
            scheduler: setupConfig.scheduler_type
        };
        
        for (const page of getLastPage) {
            const getDate = await GetDate(getDateInputs);
            console.log(getDate)
            
            const getPageInputs: GetPageInputs = { 
                page: page
            };
            for (const date of getDate){
                const getPage = await GetPage(getPageInputs);
                console.log(date, getPage)
                
                const fetchAttendaceDataInputs: FetchAttendaceDataInputs = { 
                    dates: date,
                    startPage: getPage.start,
                    endPage: getPage.end,
                    client_id: setupConfig.credential.client_id, 
                    client_secret: setupConfig.credential.client_secret
                };

                const fetchAttendaceData = await FetchAttendanceData(fetchAttendaceDataInputs);
                // console.log(fetchAttendaceData)

                const filterAbsentEmployeeInputs: FilterAbsentEmployeeInputs = { 
                    payload: fetchAttendaceData
                };

                const filterAbsentEmployee = await FilterAbsentEmployee(filterAbsentEmployeeInputs);
                storage.attendanceData.push(...filterAbsentEmployee);

                // console.log(filterAbsentEmployee);
            }
        }
        // console.log(storage.attendanceData);

        const talentaPayloadInputs: TalentaPayloadInputs = { 
            payload: storage.attendanceData
        };

        const talentaPayload = await TalentaPayload(talentaPayloadInputs);

        // console.log(talentaPayload)

        const payloadPushNotifInputs: PayloadPushNotifInputs = { 
            emailPayload: talentaPayload,
            absentPayload: storage.attendanceData
        };

        const payloadPushNotif = await PayloadPushNotif(payloadPushNotifInputs);

        // console.log(payloadPushNotif)

        // Convert the notifications_payload object to an array
        const data: Payload[] = Object.values(payloadPushNotif.notifications_payload);

        const batchSize = 50;
        const batches = chunkArray(data, batchSize);

        for (const batch of batches) {
            const sendNotificationInputs: SendNotificationInputs = { 
                payload: batch,
                email_payload: talentaPayload,
                client_id: setupConfig.credential.client_id, 
                client_secret: setupConfig.credential.client_secret 
            };
    
            const sendNotification = await SendNotification(sendNotificationInputs);
            console.log(sendNotification)
        }

    } catch (error) {
        console.error('Error in flow execution:', error);
    }
}

// Execute the flow with initial inputs
executeFlow();

