export interface GetPageInputs {
    page: number;
}

export const code = async (inputs: GetPageInputs) => {
    try {
        let pages = inputs.page;
        let start;

        if (pages % 10 !== 0) {
            // If pages is not a multiple of 10, adjust it to the closest multiple of 10 and set start to that value plus 1
            start = Math.floor(pages / 10) * 10 + 1;
        } else {
            // If pages is a multiple of 10, set start to pages - 9
            start = pages - 9;
        }

        const page = {
            start: start,
            end: pages
        };

        return page;
    } catch (error) {
        console.error('GetPage encountered an error:', error);
        throw error;
    }
};
