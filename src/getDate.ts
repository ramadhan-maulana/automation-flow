import moment, { Moment } from 'moment-timezone';

export interface GetDateInputs {
    scheduler: string;
}

export const code = async (inputs: GetDateInputs) => {
    try {
        //scheduler
        let schedule = inputs.scheduler
        // assign variable to get date
        let currentDate = moment.tz('Asia/Jakarta');
        let today = moment(currentDate).format('YYYY-MM-DD')
        let aWeekBefore = moment(today).subtract(7, 'days').format('YYYY-MM-DD');
        let currentTime = moment(currentDate).format('HH:mm'); 
        let aMonthBefore = moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD');
        let yesterday = moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD');

    
        // weekly/monthly
    
        function getDateRange(firstDate: moment.MomentInput, lastDate: moment.MomentInput) {
            if (moment(firstDate, 'YYYY-MM-DD').isSame(moment(lastDate, 'YYYY-MM-DD'), 'day'))
                return [lastDate];
            let date = firstDate;
            const dates = [date];
            do {
                date = moment(date).add(1, 'day');
                dates.push(date.format('YYYY-MM-DD'));
            } while (moment(date).isBefore(lastDate));
            
            return dates;
        };
    
        // daily
        function getDailyDate() {
            const getUserSchedule = (time: string) => {
                // buat coba
                return yesterday;
                // Jika waktu adalah 1:30 atau 10:00, ambil data dari tanggal sebelumnya
                // if (time === '13:30' || time === '10:00') {
                //     return yesterday;
                // //  Jika waktu adalah 18:00, ambil data dari tanggal saat ini
                // } else if (time === '18:00') {
                //     return today
                // // Jika waktu tidak sesuai dengan kriteria di atas, kembalikan null
                // } else {
                //     return null;
                // }
            };
            let date = getUserSchedule(currentTime);
            return [date];
        }
        
        // Function to get dates based on schedule
        function getDates(schedule: string) {
            if (schedule === 'monthly') {
                return getDateRange(aMonthBefore, yesterday);
            } else if(schedule === 'weekly') {
                return getDateRange(aWeekBefore, yesterday);
            } else {
                return getDailyDate();
            }
        }

        // Get dates based on schedule
        const listOfDates = getDates(schedule);
        console.log(listOfDates)
        return listOfDates;
    } catch (error) {
        console.error('GetDate encountered an error:', error);
        throw error;
    }
};
