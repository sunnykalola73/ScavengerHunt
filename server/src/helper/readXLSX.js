// Imports
import xlsx from "xlsx";
import path from "path";

import { createBranchContactNoTable, createBranchDetailTable, createBranchpinCodeTable, createUsersTable,createAlertsTable, addBranchDetail, addBranchContactNo, addBranchPincode, addUser } from "./poolQueries.js";


/**
 * Read the data from xls file and create a json pbject of the data 
 *@return {Object} xlData - json object
 */
export async function readXLSFile() {
    // Used xls npm package for reading the file and taken snapshot from stack-overflow
    let workbook = xlsx.readFile(path.join(__dirname, `../../data/${process.env.FILE_NAME}`));
    let sheet = workbook.SheetNames;
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheet[0]]);
}

/**
 * Initialize Databse pool create tables and insert data into the tables from xls
 */
export async function initializeDB() {

    // Creating tables (branch_details, branch_contact_no, branch_pincode)
    await createBranchDetailTable();
    await createBranchContactNoTable();
    await createBranchpinCodeTable();
    await createUsersTable();
    await createAlertsTable();
    // Read data from xlsx file.
    let xlData = await readXLSFile();

    // For each row  add the data into the database.
    xlData.forEach(row => {

        // // add data into branch_detail table form xlsx file.
        // // parameters - branchName, insitutionName, address, city, branchIncharge
        addBranchDetail(row['Branch Name'], row['Insitution Name'], row['Address'], row['City'], row['Branch Incharge']);

        // Convert contactNo to string and spliting it by ','.
        let contactNoList = row['Contact Number'].toString().split(',');
        // looping through contactNoList array to insert every contacNo of a branch.
        contactNoList.forEach(contactNo => {
            // add data into branch_contact_no table from xlsx file.
            addBranchContactNo(row['Branch Name'], contactNo.trim());
        });

        // pincode to string and spliting it by ','.
        let pincodeList = row['Pincode covered'].toString().split(',');
        // looping through pincodeList array to insert every pincode of a branch.
        pincodeList.forEach(pincode => {
            // add data into branch_pincode table from xlsx file.
            addBranchPincode(row['Branch Name'], pincode.trim());
        });
        
        // // !!!!!!!!!!!! To Dynamically generate passwors DO not Uncomment internal.
        // // addUser(row['Branch Incharge'], row['Branch Name']);
        // // addUser("admin", "ALL");
    });

}