const axios = require("axios");

async function getData() {
  const response = await axios.get(
    "https://test-share.shub.edu.vn/api/intern-test/input"
  );
  return response.data;
}

function processData(data) {
  const n = data.length;
  const prefixSum = new Array(n + 1).fill(0);
  const evenSum = new Array(n + 1).fill(0);
  const oddSum = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + data[i];
    if (i % 2 === 0) {
      evenSum[i + 1] = evenSum[i] + data[i];
      oddSum[i + 1] = oddSum[i];
    } else {
      evenSum[i + 1] = evenSum[i];
      oddSum[i + 1] = oddSum[i] + data[i];
    }
  }
  console.log("prefixSum", prefixSum);
  console.log("evenSum", evenSum);
  console.log("oddSum", oddSum);

  return { prefixSum, evenSum, oddSum };
}

function processQueries(queries, prefixSum, evenSum, oddSum) {
  const results = [];
  for (const query of queries) {
    const queryType = query.type;
    const [l, r] = query.range;
    if (queryType === "1") {
      const total = prefixSum[r + 1] - prefixSum[l];
      results.push(total);
    } else if (queryType === "2") {
      const totalEven = evenSum[r + 1] - evenSum[l];
      const totalOdd = oddSum[r + 1] - oddSum[l];
      let result = totalEven - totalOdd;
      if (l % 2 === 1) result = -result;
      results.push(result);
    }
  }
  return results;
}

async function sendResults(token, results) {
  const url = "https://test-share.shub.edu.vn/api/intern-test/output";
  const headers = { Authorization: `Bearer ${token}` };
  const data = results;
  const response = await axios.post(url, data, { headers });
  return response.data;
}

async function main() {
  try {
    const inputData = await getData();
    console.log("Token:", inputData.token);
    console.log("Data Array:", inputData.data);
    console.log("Data length:", inputData.data.length);
    console.log("Query Array:", inputData.query);
    const token = inputData.token;
    const data = inputData.data;
    const queries = inputData.query;

    const { prefixSum, evenSum, oddSum } = processData(data);

    const results = processQueries(queries, prefixSum, evenSum, oddSum);
    console.log("result", results);
    const response = await sendResults(token, results);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
