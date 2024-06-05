import axios from 'axios';
import crypto_js from 'crypto-js';

export interface FetchAttendaceDataInputs {
    dates: any;
    startPage: number;
    endPage: number;
    client_id: string;
    client_secret: string;
}

export const code = async (inputs: FetchAttendaceDataInputs) => {
    try {
        interface SummaryAttendanceReport {
            user_id: number;
            employee_id: string;
            full_name: string;
            attendance_code: string;
            timeoff_code: string;
            holiday: boolean;
            date: string;
          }
        
          interface Data {
            message: string;
            data: {
              summary_attendance_report: SummaryAttendanceReport[];
            };
          }
        
          // Get Date from inputs
          const date = inputs.dates;
        
          // Function to generate HMAC header
          function generateHmacHeader(date: string, page: number) {
            const client_id = inputs.client_id;
            const client_secret = inputs.client_secret;
            const method = 'GET';
            const path = `/v2/talenta/v3/attendance/summary-report?date=${date}&limit=150&order=asc&page=${page}&sort=clock_in`;
        
            // Define current date and add 7 hours
            const currentDate = new Date().toUTCString();
        
            const requestLine = `${method} ${path} HTTP/1.1`;
            const payload = [`date: ${currentDate}`, requestLine].join('\n');
            const digest = crypto_js.HmacSHA256(payload, client_secret);
            const signature = crypto_js.enc.Base64.stringify(digest);
            const authorizationHeader = `hmac username="${client_id}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;
        
            return {
              'Content-Type': 'application/json',
              'Date': currentDate,
              'Authorization': authorizationHeader
            };
          }
        
          // Function to fetch attendance data
          async function fetchAttendanceData(date: string, page: number) {
            const url = `https://api.mekari.com/v2/talenta/v3/attendance/summary-report?date=${date}&limit=150&order=asc&page=${page}&sort=clock_in`;
            const headers = generateHmacHeader(date, page);
            const response = await axios.get(url, { headers });
            const data: Data = response.data;
        
            const totalData = data.data.summary_attendance_report.map(report => ({
              user_id: report.user_id,
              employee_id: report.employee_id,
              full_name: report.full_name,
              attendance_code: report.attendance_code,
              timeoff_code: report.timeoff_code,
              holiday: report.holiday,
              date: date
            }));
        
            return { totalData };
          }
          
        
          // Utilize the provided pages array from inputs
          let startPage = inputs.startPage;
          let endPage = inputs.endPage;
         
           // Fetch data for each range of pages
          let allData: SummaryAttendanceReport[] = [];
        
           for (let page = startPage; page <= endPage; page++) {
              const response = await fetchAttendanceData(date, page);
              console.log(`Fetching data for page: ${page}`);
              allData.push(...response.totalData);
            }
           
        
          return allData ;
    } catch (error) {
        console.error('FetchAttendanceData encountered an error:', error);
        throw error;
    }
};
