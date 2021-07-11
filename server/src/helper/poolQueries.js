import mysql from 'mysql';
import { promisify } from 'util';
import bcrypt, { compareSync } from "bcrypt";
import Randomstring from 'randomstring';


// DB Hosted on https://remotemysql.com/databases.php 
export let pool = mysql.createPool({
    connectionLimit: 7,
    host: 'remotemysql.com',
    user: 'ESonISz4kZ',
    password: 'QkxUvTSVlS',
    database: 'ESonISz4kZ'
});


// branch_detail - Table  Query
const branchDetail = 'CREATE TABLE IF NOT EXISTS `branch_detail` (`branchName` varchar(100) NOT NULL, `insitutionName` varchar(100) NOT NULL, `address` varchar(100) NOT NULL, `city` varchar(100) NOT NULL, `branchIncharge` varchar(100) NOT NULL, PRIMARY KEY (`branchName`))'
export const createBranchDetailTable = async () => {
    pool.query(branchDetail, function (error, results) {
        if (error) throw error;
        console.log('branchDetail - The solution is: ', results);
    });
}

// add data in branch_detail table from excel file.
export const addBranchDetail = (branchName, insitutionName, address, city, branchIncharge) => {
    let branchData = `INSERT INTO branch_detail (branchName, insitutionName, address, city, branchIncharge)VALUES ("${branchName}", "${insitutionName}", "${address}", "${city}", "${branchIncharge}");`
    pool.query(branchData, function (error, results) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') console.log("Item already Exists in table!")
            else throw error;
        }
        else console.log('addbBranchDetails - The solution is: ', results);
    });
}


// branch_contact_no -  Table Query
const branchContactNo = 'CREATE TABLE IF NOT EXISTS `branch_contact_no` (`branchName` varchar(100) NOT NULL, `contactNo` varchar(100) NOT NULL, PRIMARY KEY (`contactNo`,`branchName`), KEY `branchName_idx` (`branchName`), CONSTRAINT `branchName_contact_no` FOREIGN KEY (`branchName`) REFERENCES `branch_detail` (`branchName`))'
export const createBranchContactNoTable = async () => {
    pool.query(branchContactNo, function (error, results) {
        if (error) throw error;
        console.log('branchContactNo - The solution is: ', results);
    });
}

// add data in branch_contact_no table from excel file.
export const addBranchContactNo = (branchName, contactNo) => {
    let branchData = `INSERT INTO branch_contact_no (branchName, contactNo ) VALUES ("${branchName}", "${contactNo}") ;`
    pool.query(branchData, function (error, results) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') console.log("Item already Exists in table!")
            else throw error;
        }
        else console.log('addBranchContactNo - The solution is: ', results);
    });
}


// branch_pincode -  Table Query
const branchPincode = 'CREATE TABLE IF NOT EXISTS `branch_pincode` (`branchName` varchar(100) NOT NULL, `pincode` varchar(100) NOT NULL, PRIMARY KEY (`branchName`,`pincode`), CONSTRAINT `branchName_pincode` FOREIGN KEY (`branchName`) REFERENCES `branch_detail` (`branchName`) )'
export const createBranchpinCodeTable = async () => {
    pool.query(branchPincode, function (error, results) {
        if (error) throw error;
        console.log('branchPincode - The solution is: ', results);
    });
}

// add data in branch_contact_no table from excel file.
export const addBranchPincode = (branchName, pincode) => {
    let branchPincodeData = `INSERT INTO branch_pincode (branchName, pincode ) VALUES ("${branchName}", "${pincode}");`
    pool.query(branchPincodeData, function (error, results) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') console.log("Item already Exists in table!");
            else throw error;
        }
        else console.log('addBranchPincode - The solution is: ', results);
    });
}

// get branch details from pincode 
export async function getBranchDeatailsFromPincode(pincode) {

    let getBranchDetailsFromPincodeQuery = `SELECT * from branch_detail as bd NATURAL JOIN branch_pincode as bpin NATURAL JOIN branch_contact_no as bcontact WHERE bd.branchName = bpin.branchName AND bpin.pincode =${pincode} AND bd.branchName = bcontact.branchName;`
    let query = promisify(pool.query).bind(pool);
    return await query(getBranchDetailsFromPincodeQuery);
    // let branchDetails = [];
    // let branchName = new Set();
    // results.forEach(row => {
    //     branchName.add(row['branchName']);
    // });
    // branchName.forEach(branch => {
    //     let contactNoList = [];
    //     let branchData = results.filter(result => result['branchName'] = branch );
    //     for(contact of branchData) {
    //         contactNoList.append(contact['contactNo']);
    //     }
    //     console.log(contactNoList);
    // });
}

// // To create use table Dynamically
// users -  Table Query
const users = 'CREATE TABLE IF NOT EXISTS `users` (`userName` varchar(100) NOT NULL, `password` varchar(150) NOT NULL, `branchName` varchar(100) NOT NULL, PRIMARY KEY (`branchName`))';
export const createUsersTable = async () => {
    pool.query(users, function (error, results) {
        if (error) throw error;
        console.log('users - The solution is: ', results);
    });
}

// // To create user Dynamicallly  DO Not Run it Or uncommnet it. FOR ONE TIME USE ONLY
// export let addUser = async (branchIncharge, branchName) => {
//     let userName = branchIncharge.replace(/ /g, '_');
//     let password = Randomstring.generate({ length: 8, charset: 'alphabetic' });
//     console.log(`${branchName} -- ${userName}/${password}`);
//     // Generating salt for storing passowrd
//     const salt = await bcrypt.genSalt(10);
//     // encrypting password with salt
//     let hashPassword = await bcrypt.hash(password, salt);

//     // console.log(hashPassword);

//     let userData = `INSERT INTO users (userName, password, branchName ) VALUES ("${userName}", "${hashPassword}", "${branchName}");`
//     pool.query(userData, function (error, results) {
//         if (error) {
//             if (error.code === 'ER_DUP_ENTRY') console.log("Item already Exists in table!")
//             else throw error;
//         }
//         else console.log('addUser - The solution is: ', results);
//     });
// }

export let verifyUser = async (userName, password) => {
    let userData = `SELECT branchName, password from users u WHERE u.userName="${userName}";`;
    let query = promisify(pool.query).bind(pool);
    let result = await query(userData);
    if (result.length) {
        let isValid = await bcrypt.compare(password, result[0].password);
        if (isValid) return result[0].branchName;
        else return null;
    }
    else return null;
}

export let getBranchFromUserName = async (userName) => {
    let userData = `SELECT branchName from users u WHERE u.userName="${userName}";`;
    let query = promisify(pool.query).bind(pool);
    let result = await query(userData);
    if (result.length) {
        return result[0].branchName;
    }
    else return null;
}

// get branch details from branchName 
export async function getBranchDeatailsFromBranch(branchName) {
    let getBranchDetailsFromBranchQuery;
    if (branchName === "ALL") getBranchDetailsFromBranchQuery = `SELECT * from branch_detail as bd NATURAL JOIN branch_pincode as bpin NATURAL JOIN branch_contact_no as bcontact WHERE bd.branchName = bpin.branchName AND bd.branchName = bcontact.branchName;`
    else getBranchDetailsFromBranchQuery = `SELECT * from branch_detail as bd NATURAL JOIN branch_pincode as bpin NATURAL JOIN branch_contact_no as bcontact WHERE bd.branchName="${branchName}" AND bd.branchName = bpin.branchName AND bd.branchName = bcontact.branchName;`
    let query = promisify(pool.query).bind(pool);
    let results = await query(getBranchDetailsFromBranchQuery);
    console.log(results);
    if (results) return results;
}

// // To create use table Dynamically
// alerts -  Table Query
const alerts = 'CREATE TABLE IF NOT EXISTS `alerts` (`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NULL, `contactNo` VARCHAR(100) NULL, `pincode` VARCHAR(100) NULL, `isRead` TINYINT NULL, PRIMARY KEY (`id`));';
export const createAlertsTable = async () => {
    pool.query(alerts, function (error, results) {
        if (error) throw error;
        console.log('alerts - The solution is: ', results);
    });
}

// add data in alerts table.
export const addAlert = (pincode, contactNo, name) => {
    let branchPincodeData = `INSERT INTO alerts (pincode, contactNo, name, isRead ) VALUES ("${pincode}", "${contactNo}", "${name}", FALSE);`
    pool.query(branchPincodeData, function (error, results) {
        if (error) throw error;
        else console.log('addBranchPincode - The solution is: ', results);
    });
}

// get alerts details from pincode 
export async function getAlertsFromBranch(branchName) {
    let getBranchDetailsFromBranchQuery;
    if (branchName === "ALL") {
        getBranchDetailsFromBranchQuery = `select * from alerts;`
    }
    else {
        getBranchDetailsFromBranchQuery = `select pincode,contactNo,isRead,name from branch_pincode as bpin NATURAL JOIN alerts where bpin.pincode=alerts.pincode AND bpin.branchName="${branchName}";`
    }
    let query = promisify(pool.query).bind(pool);
    let results = await query(getBranchDetailsFromBranchQuery);
    console.log("Resssss: ", results);
    if (results) return results;
}

// Mark alert as read on base of username 
export async function markAlertsAsRead(branchName) {
    let getBranchDetailsFromBranchQuery;
    if (branchName === "ALL") {
        getBranchDetailsFromBranchQuery = `UPDATE branch_pincode as bpin NATURAL JOIN alerts SET isRead =1 WHERE bpin.pincode=alerts.pincode;`
    }
    else {
        getBranchDetailsFromBranchQuery = `UPDATE branch_pincode as bpin NATURAL JOIN alerts SET isRead =1 WHERE bpin.pincode=alerts.pincode AND bpin.branchName="${branchName}";`
    }
    let query = promisify(pool.query).bind(pool);
    let results = await query(getBranchDetailsFromBranchQuery);
    console.log("Resddssss: ", results);

    if (results) return results;
}