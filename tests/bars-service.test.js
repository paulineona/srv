
// const { readCsv, readTxt } = require('../src/utils/fileReader');

// describe('readCsv', () => {
//     it('should read and format CSV data correctly', async () => {
//         const filePath = 'uploads/valid-csv.csv';
//         const expectedRecords = [
//             {
//                 billing_cycle: 1,
//                 start_date: '2022-01-01T00:00:00.000Z',
//                 end_date: '2022-01-31T00:00:00.000Z',
//             },
//             // Add more expected records here
//         ];

//         const records = await readCsv(filePath);

//         expect(records).toEqual(expectedRecords);
//     });

//     it('should throw an error for invalid CSV data', async () => {
//         const filePath = 'path/to/invalid/csv/file.csv';

//         await expect(readCsv(filePath)).rejects.toThrow();
//     });
// });

// describe('readTxt', () => {
//     it('should read and format TXT data correctly', async () => {
//         const filePath = 'path/to/txt/file.txt';
//         const expectedRecords = [
//             {
//                 billing_cycle: 1,
//                 start_date: '2022-01-01T00:00:00.000Z',
//                 end_date: '2022-01-31T00:00:00.000Z',
//             },
//             // Add more expected records here
//         ];

//         const records = await readTxt(filePath);

//         expect(records).toEqual(expectedRecords);
//     });

//     it('should throw an error for invalid TXT data', async () => {
//         const filePath = 'path/to/invalid/txt/file.txt';

//         await expect(readTxt(filePath)).rejects.toThrow();
//     });
// });
