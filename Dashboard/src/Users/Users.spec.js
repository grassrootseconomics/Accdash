import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import Users, { summaryQuery } from "./Users";

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
                { yearMonth: "2019-04", Total: 884, Frequent: 583 },
                { yearMonth: "2019-05", Total: 1304, Frequent: 428 },
                { yearMonth: "2019-06", Total: 1503, Frequent: 349 },
                { yearMonth: "2019-07", Total: 1797, Frequent: 557 },
                { yearMonth: "2019-08", Total: 1247, Frequent: 257 },
                { yearMonth: "2019-09", Total: 993, Frequent: 186 },
                { yearMonth: "2019-10", Total: 1415, Frequent: 214 },
                { yearMonth: "2019-11", Total: 1578, Frequent: 280 },
                { yearMonth: "2019-12", Total: 1660, Frequent: 376 },
                { yearMonth: "2020-01", Total: 2006, Frequent: 292 },
                { yearMonth: "2020-02", Total: 2973, Frequent: 421 },
                { yearMonth: "2020-03", Total: 3428, Frequent: 606 }
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
        <Users
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
      <Users />
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
          <Users
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
