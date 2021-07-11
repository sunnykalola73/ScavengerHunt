import _uniqBy from "lodash/uniqBy";
import _map from "lodash/map";
import _reduce from "lodash/reduce";
import _uniq from "lodash/uniq";
import _isEmpty from "lodash/isEmpty";

export const parseData = (results) => {
  const parsedResults = _uniqBy(results, "branchName");
  console.log(parsedResults);
  return _map(parsedResults, (result) => {
    const contactNos = _reduce(
      results,
      (acc, value) => {
        if (value.branchName === result.branchName) {
          if (!_isEmpty(value.contactNo)) acc.push(value.contactNo);
        }
        return acc;
      },
      []
    );
    const pincodes = _reduce(
      results,
      (acc, value) => {
        if (value.branchName === result.branchName) {
          // console.log("value.pincode----", value.pincode);
          if (!_isEmpty(value.pincode.trim())) acc.push(value.pincode);
        }
        return acc;
      },
      []
    );
    return {
      ...result,
      contactNo: _uniq(contactNos),
      pincode: _uniq(pincodes),
    };
  });
};
