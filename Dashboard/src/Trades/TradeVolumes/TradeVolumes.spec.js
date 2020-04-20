import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import TradeVolumes, { summaryQuery } from "./TradeVolumes";

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
                  Education: 84480.0,
                  Environment: 3355.0,
                  "Farming/Labour": 362841.0,
                  "Food/Water": 380566.02,
                  "Fuel/Energy": 58616.0,
                  Health: 1445.0,
                  Other: 0,
                  "Savings Group": 0,
                  Shop: 85038.0,
                  System: 0,
                  Transport: 41452.0,
                  Unknown: 91155.4617096967
                },
                {
                  yearMonth: "2019-05",
                  Education: 323365.0,
                  Environment: 850.0,
                  "Farming/Labour": 183016.0,
                  "Food/Water": 328761.0,
                  "Fuel/Energy": 30100.0,
                  Health: 2985.0,
                  Other: 0,
                  "Savings Group": 50.0,
                  Shop: 83349.0,
                  System: 0,
                  Transport: 40033.0,
                  Unknown: 55957.7415629267
                },
                {
                  yearMonth: "2019-06",
                  Education: 46088.0,
                  Environment: 1005.0,
                  "Farming/Labour": 346456.0,
                  "Food/Water": 236764.0,
                  "Fuel/Energy": 23234.0,
                  Health: 4225.0,
                  Other: 0,
                  "Savings Group": 28605.0,
                  Shop: 84308.0,
                  System: 0,
                  Transport: 48930.0,
                  Unknown: 142969.652324251
                },
                {
                  yearMonth: "2019-07",
                  Education: 102694.0,
                  Environment: 2630.0,
                  "Farming/Labour": 515017.0,
                  "Food/Water": 471843.0,
                  "Fuel/Energy": 39567.0,
                  Health: 14631.0,
                  Other: 0,
                  "Savings Group": 338878.0,
                  Shop: 310474.0,
                  System: 0,
                  Transport: 118269.0,
                  Unknown: 222595.924000737
                },
                {
                  yearMonth: "2019-08",
                  Education: 70285.0,
                  Environment: 2878.0,
                  "Farming/Labour": 611453.0,
                  "Food/Water": 337896.0,
                  "Fuel/Energy": 24822.0,
                  Health: 3125.0,
                  Other: 0,
                  "Savings Group": 252847.0,
                  Shop: 345107.0,
                  System: 0,
                  Transport: 101879.0,
                  Unknown: 216460.745037679
                },
                {
                  yearMonth: "2019-09",
                  Education: 35104.0,
                  Environment: 2330.0,
                  "Farming/Labour": 375602.0,
                  "Food/Water": 354941.0,
                  "Fuel/Energy": 48361.0,
                  Health: 8180.0,
                  Other: 0,
                  "Savings Group": 404128.0,
                  Shop: 216424.0,
                  System: 0,
                  Transport: 76570.0,
                  Unknown: 156398.115778099
                },
                {
                  yearMonth: "2019-10",
                  Education: 39752.0,
                  Environment: 1.0,
                  "Farming/Labour": 663631.0,
                  "Food/Water": 391685.0,
                  "Fuel/Energy": 126538.0,
                  Health: 1965.0,
                  Other: 0,
                  "Savings Group": 492129.0,
                  Shop: 287125.0,
                  System: 0,
                  Transport: 54107.0,
                  Unknown: 217287.390639924
                },
                {
                  yearMonth: "2019-11",
                  Education: 27092.0,
                  Environment: 7700.0,
                  "Farming/Labour": 886722.0,
                  "Food/Water": 589966.0,
                  "Fuel/Energy": 64926.0,
                  Health: 10608.0,
                  Other: 0,
                  "Savings Group": 722015.0,
                  Shop: 518721.279671889,
                  System: 0,
                  Transport: 131639.0,
                  Unknown: 332471.013544821
                },
                {
                  yearMonth: "2019-12",
                  Education: 29025.0,
                  Environment: 10.0,
                  "Farming/Labour": 625967.0,
                  "Food/Water": 400171.0,
                  "Fuel/Energy": 114502.0,
                  Health: 1400.0,
                  Other: 0,
                  "Savings Group": 799386.0,
                  Shop: 397785.0,
                  System: 0,
                  Transport: 66865.0,
                  Unknown: 212311.829712442
                },
                {
                  yearMonth: "2020-01",
                  Education: 6361.0,
                  Environment: 150.0,
                  "Farming/Labour": 236279.0,
                  "Food/Water": 460521.122353641,
                  "Fuel/Energy": 33859.0,
                  Health: 273.0,
                  Other: 0,
                  "Savings Group": 1026941.0,
                  Shop: 115231.0,
                  System: 0,
                  Transport: 6174.0,
                  Unknown: 144328.749936918
                },
                {
                  yearMonth: "2020-02",
                  Education: 10366.0,
                  Environment: 180.0,
                  "Farming/Labour": 375486.0,
                  "Food/Water": 413739.0,
                  "Fuel/Energy": 98302.0,
                  Health: 842.0,
                  Other: 0,
                  "Savings Group": 998360.62,
                  Shop: 149854.0,
                  System: 147.0,
                  Transport: 20007.0,
                  Unknown: 0
                },
                {
                  yearMonth: "2020-03",
                  Education: 31586.0,
                  Environment: 2702.0,
                  "Farming/Labour": 623824.34,
                  "Food/Water": 734349.1,
                  "Fuel/Energy": 126926.1,
                  Health: 3082.0,
                  Other: 0,
                  "Savings Group": 1163874.12,
                  Shop: 331262.0,
                  System: 2.0,
                  Transport: 45357.0,
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
        <TradeVolumes
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
      <TradeVolumes />
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
          <TradeVolumes
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
