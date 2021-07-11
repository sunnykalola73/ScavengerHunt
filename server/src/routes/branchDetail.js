import express from "express";

import { getBranchDeatailsFromPincode, addAlert } from "../helper/poolQueries";
export const branchDetailRouter = express.Router();

branchDetailRouter.post('/', async (req, res) => {
    console.log(req.body);
    let { pincode, contactNo, name } = req.body;
    try {
        let results = await getBranchDeatailsFromPincode(pincode);
        await addAlert(pincode, contactNo, name);
        if (results.length) res.status(200).send({ "result": results });
        else res.sendStatus(404);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

