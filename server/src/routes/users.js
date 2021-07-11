import express from "express";
import { verifyUser } from "../helper/poolQueries";
import { getBranchDeatailsFromBranch, getAlertsFromBranch, getBranchFromUserName, markAlertsAsRead } from "../helper/poolQueries";

export const userRouter = express.Router();

userRouter.post('/authentication', async (req, res) => {
    let { userName, password } = req.body;
    try {
        let branchName = await verifyUser(userName, password);
        if (branchName) {
            let results = await getBranchDeatailsFromBranch(branchName);
            res.status(200).send({ "results": results });
        }
        else {
            res.sendStatus(403);
        }
    } catch (err) {
        console.log(err);
    }
});



userRouter.post('/alerts', async (req, res) => {
    let { userName } = req.body;
    try {
        let branchName = await getBranchFromUserName(userName);
        if (branchName) {
            let alerts = await getAlertsFromBranch(branchName);
            res.status(200).send({ "alerts": alerts });
        }
        else {
            res.sendStatus(403);
        }

    } catch (err) {
        console.log(err);
    }
});

userRouter.post('/alerts/markRead', async (req, res) => {
    let { userName } = req.body;
    try {
        let branchName = await getBranchFromUserName(userName);
        if (branchName) {
            let alerts = await markAlertsAsRead(branchName);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(403);
        }

    } catch (err) {
        console.log(err);
    }
});

