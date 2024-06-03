interface payload{
  user_id: number;
  employee_id: string;
  full_name: string;
  attendance_code: string;
  timeoff_code: string;
  holiday: boolean;
  date: string;
}

export interface FilterAbsentEmployeeInputs {
  payload: payload[];
}

export const code = async (inputs: FilterAbsentEmployeeInputs) => {
    try {
      // Function to filter absent employees
      async function filterAbsentEmployees() {
        const employeeData = inputs.payload;

        // Check if employeeData is an array
        if (!Array.isArray(employeeData)) {
            console.error("Employee data is not an array");
            
        }

        // Filter out the absent employees based on conditions
        const filteredEmployees = employeeData.filter((employee) => {
            // If holiday is true, then don't include
            if (employee.holiday) {
                return false;
            }else{
                if (employee.timeoff_code !== "" && employee.attendance_code === ""){
                    // If holiday is false but timeoff_code not empty and attendance_code is empty, then don't include
                    return false;
                }else if(employee.timeoff_code === "" && employee.attendance_code === ""){
                    // If holiday is false, timeoff_code is empty, and attendance_code is empty, then include
                    return true;
                }
            }
            // Default: Don't include for other cases
            return false;
        });

        // Create the output payload with only the required fields for absent employees
        const output = filteredEmployees.map(employee => ({
            user_id: employee.user_id,
            employee_id: employee.employee_id,
            full_name: employee.full_name,
            date: employee.date
        }));

        // Return the output payload
        return output;
    }

    // Call the function to filter absent employees and return the result
    return await filterAbsentEmployees();
    } catch (error) {
        console.error('FetchAttendanceData encountered an error:', error);
        throw error;
    }
};
