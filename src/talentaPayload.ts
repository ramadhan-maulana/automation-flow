interface absentEmployee{
    user_id: number;
    employee_id: string;
    full_name: string;
    date: string;
}

export interface TalentaPayloadInputs {
    payload: absentEmployee[];
}

export const code = async (inputs: TalentaPayloadInputs) => {
    try {
        // Parse the input JSON string
        const inputJson = inputs.payload;
        // Access the array of absent employees
        // If absentEmployees is undefined, throw an error
        if (!inputJson) {
            throw new Error('Invalid input payload format. Expected "absent_employee" array.');
        }

        // Generate the message 
        let html = `
            <div class="col l12 pad-20" style="
                border: 1px solid;
                border-radius: 10px;">
                <span class="lato">
            <p style="font-size: 1.3em;font-weight: bold;">Absent Employees</p>
            <p style="font-size: 1.125em;">Hello \${name}, report on absent employees.</p>

            <table style="border-collapse: collapse;">
                <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                </tr>`;

        inputJson.forEach(employee => {
            html += `
                <tr>
                    <td style="border-bottom: 1px solid #ddd">${employee.full_name}</td>
                    <td style="border-bottom: 1px solid #ddd">${employee.employee_id}</td>
                    <td style="border-bottom: 1px solid #ddd">${employee.date}</td>
                </tr>`;
        });

        html += '</table></span></div>';

        // Return the HTML message with the table
        return html;
    } catch (error) {
        console.error('TalentaPayload encountered an error:', error);
        throw error;
    }
};
