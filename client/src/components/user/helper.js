import _uniqBy from "lodash/uniqBy";
import _map from "lodash/map";
import _reduce from "lodash/reduce";

export const parseData = (results) => {
  const parsedResults = _uniqBy(results, "branchName");
  console.log(parsedResults);
  return _map(parsedResults, (result) => {
    const contactNos = _reduce(
      results,
      (acc, value) => {
        if (value.branchName === result.branchName) {
          acc.push(value.contactNo);
        }
        return acc;
      },
      []
    );
    return {
      ...result,
      contactNo: contactNos,
    };
  });
};
