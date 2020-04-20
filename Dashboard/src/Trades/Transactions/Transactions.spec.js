import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import Transactions, { summaryQuery } from "./Transactions";

const from = "2019-04";
const to = "2020-03";
const tokens = [];
const spendTypes = [];
const gender = ["Male", "Female"];
const txType = [];

it("renders without error", async () => {
  const mocks = [
    {
      request: {
        query: summaryQuery,
        variables: {
          from,
          to,
          tokens,
          spendTypes,
          gender,
          txType
        }
      },
      result: {
        data: {
          monthlySummaryData: [
            {
              value: [
                {
                  yearMonth: "2019-04",
                  Education: 956,
                  Environment: 66,
                  "Farming/Labour": 1846,
                  "Food/Water": 5609,
                  "Fuel/Energy": 926,
                  Health: 16,
                  Other: 0,
                  "Savings Group": 0,
                  Shop: 1219,
                  System: 0,
                  Transport: 433,
                  Unknown: 1002
                },
                {
                  yearMonth: "2019-05",
                  Education: 759,
                  Environment: 18,
                  "Farming/Labour": 1532,
                  "Food/Water": 2867,
                  "Fuel/Energy": 418,
                  Health: 35,
                  Other: 0,
                  "Savings Group": 1,
                  Shop: 682,
                  System: 0,
                  Transport: 316,
                  Unknown: 712
                },
                {
                  yearMonth: "2019-06",
                  Education: 169,
                  Environment: 6,
                  "Farming/Labour": 1714,
                  "Food/Water": 1892,
                  "Fuel/Energy": 216,
                  Health: 36,
                  Other: 0,
                  "Savings Group": 287,
                  Shop: 587,
                  System: 0,
                  Transport: 240,
                  Unknown: 982
                },
                {
                  yearMonth: "2019-07",
                  Education: 136,
                  Environment: 13,
                  "Farming/Labour": 1838,
                  "Food/Water": 1622,
                  "Fuel/Energy": 154,
                  Health: 47,
                  Other: 0,
                  "Savings Group": 1932,
                  Shop: 812,
                  System: 0,
                  Transport: 288,
                  Unknown: 1305
                },
                {
                  yearMonth: "2019-08",
                  Education: 91,
                  Environment: 8,
                  "Farming/Labour": 1218,
                  "Food/Water": 719,
                  "Fuel/Energy": 69,
                  Health: 15,
                  Other: 0,
                  "Savings Group": 1009,
                  Shop: 416,
                  System: 0,
                  Transport: 100,
                  Unknown: 567
                },
                {
                  yearMonth: "2019-09",
                  Education: 61,
                  Environment: 4,
                  "Farming/Labour": 615,
                  "Food/Water": 712,
                  "Fuel/Energy": 72,
                  Health: 11,
                  Other: 0,
                  "Savings Group": 937,
                  Shop: 351,
                  System: 0,
                  Transport: 78,
                  Unknown: 449
                },
                {
                  yearMonth: "2019-10",
                  Education: 32,
                  Environment: 1,
                  "Farming/Labour": 978,
                  "Food/Water": 1065,
                  "Fuel/Energy": 144,
                  Health: 15,
                  Other: 0,
                  "Savings Group": 977,
                  Shop: 481,
                  System: 0,
                  Transport: 95,
                  Unknown: 634
                },
                {
                  yearMonth: "2019-11",
                  Education: 47,
                  Environment: 2,
                  "Farming/Labour": 1187,
                  "Food/Water": 1325,
                  "Fuel/Energy": 128,
                  Health: 17,
                  Other: 0,
                  "Savings Group": 1046,
                  Shop: 571,
                  System: 0,
                  Transport: 87,
                  Unknown: 633
                },
                {
                  yearMonth: "2019-12",
                  Education: 34,
                  Environment: 1,
                  "Farming/Labour": 1414,
                  "Food/Water": 1687,
                  "Fuel/Energy": 229,
                  Health: 11,
                  Other: 0,
                  "Savings Group": 1364,
                  Shop: 686,
                  System: 0,
                  Transport: 58,
                  Unknown: 611
                },
                {
                  yearMonth: "2020-01",
                  Education: 18,
                  Environment: 2,
                  "Farming/Labour": 1065,
                  "Food/Water": 1400,
                  "Fuel/Energy": 258,
                  Health: 5,
                  Other: 0,
                  "Savings Group": 1701,
                  Shop: 418,
                  System: 0,
                  Transport: 39,
                  Unknown: 396
                },
                {
                  yearMonth: "2020-02",
                  Education: 63,
                  Environment: 3,
                  "Farming/Labour": 1691,
                  "Food/Water": 2188,
                  "Fuel/Energy": 493,
                  Health: 7,
                  Other: 0,
                  "Savings Group": 2450,
                  Shop: 730,
                  System: 7,
                  Transport: 95,
                  Unknown: 0
                },
                {
                  yearMonth: "2020-03",
                  Education: 93,
                  Environment: 23,
                  "Farming/Labour": 2574,
                  "Food/Water": 2768,
                  "Fuel/Energy": 527,
                  Health: 23,
                  Other: 0,
                  "Savings Group": 2340,
                  Shop: 1079,
                  System: 1,
                  Transport: 176,
                  Unknown: 0
                }
              ],
              __typename: "time_summary"
            }
          ]
        }
      }
    }
  ];
  await act(async () =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Transactions
          from={from}
          to={to}
          tokens={tokens}
          spendTypes={spendTypes}
          gender={gender}
          txType={txType}
        />
      </MockedProvider>
    )
  );
});

it("should show loading", async () => {
  const component = render(
    <MockedProvider mocks={[]}>
      <Transactions />
    </MockedProvider>
  );

  const element = component.getByTestId("loading");
  const content = await findByText(element, "Loading data...");

  expect(element).toBeTruthy();
  expect(content).toBeTruthy();
});

it("should show error", async () => {
  const mock = {
    request: {
      query: summaryQuery,
      variables: {
        from,
        to,
        tokens,
        spendTypes,
        gender,
        txType
      }
    },
    result: {
      loading: false,
      errors: [{ message: "DB connection failure" }]
    }
  };
  let component = null;
  await act(
    async () =>
      (component = render(
        <MockedProvider mocks={[mock]} addTypename={false}>
          <Transactions
            from={from}
            to={to}
            tokens={tokens}
            spendTypes={spendTypes}
            gender={gender}
            txType={txType}
          />
        </MockedProvider>
      ))
  );

  await wait(500);
  const element = await component.getByTestId("apiError");
  const content = await findByText(
    element,
    "API returned an error Please try again"
  );

  expect(element).toBeTruthy();
  expect(content).toBeTruthy();
});
