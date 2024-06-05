import axios from 'axios';
import crypto_js from 'crypto-js';

export interface GetLastPageInputs {
    client_id: string;
    client_secret: string;  // Add any additional parameters needed by GetLastPage
}

export const code = async (inputs: GetLastPageInputs) => {
    try {
        interface SummaryAttendanceReport {
            user_id: number;
            employee_id: string;
            full_name: string;
            attendance_code: string;
            timeoff_code: string;
            holiday: boolean;
          }
        
          interface Pagination {
            current_page: number;
            first_page_url: string;
            from: number;
            last_page: number;
            last_page_url: string;
            next_page_url: string;
            path: string;
            per_page: number;
            prev_page_url: string | null;
            to: number;
            total: number;
          }
        
          interface Data {
            message: string;
            data: {
              summary_attendance_report: SummaryAttendanceReport[];
              pagination: Pagination;
            };
          }
        
          // Get yesterday's date
          const date = new Date();
          // Add 7 hours
          date.setHours(date.getHours() + 7);
          const currentDate = date.toISOString().split('T')[0];
        
          // Function to generate HMAC header
          function generateHmacHeader(date: string, page: number) {
            const client_id = inputs.client_id;
            const client_secret = inputs.client_secret;
            const method = 'GET';
            const path = `/v2/talenta/v3/attendance/summary-report?date=${date}&limit=150&order=asc&page=${page}&sort=clock_in`;
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
        
          
          // Fetch data for page 1
          let url = `https://api.mekari.com/v2/talenta/v3/attendance/summary-report?date=${currentDate}&limit=150&order=asc&page=1&sort=clock_in`;
          let headers = generateHmacHeader(currentDate, 1);
          let response = await axios.get(url, { headers });
          const data: Data = response.data;
        
          let totalData: SummaryAttendanceReport[] = [];
          totalData.push(...data.data.summary_attendance_report);
        
        
          // const lastPage = data.data .pagination.last_page;
          // since phase one only expect 100-200 employee data, limit data only 2 pages
          const lastPage = 2;
          //Generate array of numbers that are multiples of 10 up to lastPage
          let pages = [];
          for (let page = 10; page <= lastPage; page += 10) {
            pages.push(page);
          }
          // If lastPage is not a multiple of 10, add it to the array
          if (lastPage % 10 !== 0) {
            pages.push(lastPage);
          }

        console.log('getLastPage data:', pages);
        return pages ;
    } catch (error) {
        console.error('GetLastPage encountered an error:', error);
        throw error;
    }
};
