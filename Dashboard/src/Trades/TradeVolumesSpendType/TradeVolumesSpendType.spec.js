import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import TradeVolumesSpendType, { summaryQuery } from "./TradeVolumesSpendType";

const from = "2019-04";
const to = "2020-03";
const tokens = [];
const spendTypes = [];
const gender = ["Male", "Female"];
const txType = [];

it("renders without error", () => {
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
          categorySummary: [
            {
              label: "Education",
              value: 806198,
              __typename: "category_summary"
            },
            {
              label: "Environment",
              value: 23791,
              __typename: "category_summary"
            },
            {
              label: "Farming/Labour",
              value: 5806294,
              __typename: "category_summary"
            },
            {
              label: "Food/Water",
              value: 5101202,
              __typename: "category_summary"
            },
            {
              label: "Fuel/Energy",
              value: 789753,
              __typename: "category_summary"
            },
            { label: "Health", value: 52761, __typename: "category_summary" },
            { label: "Other", value: 0, __typename: "category_summary" },
            {
              label: "Savings Group",
              value: 6227213,
              __typename: "category_summary"
            },
            { label: "System", value: 149, __typename: "category_summary" },
            { label: "Shop", value: 2924678, __typename: "category_summary" },
            {
              label: "Transport",
              value: 751282,
              __typename: "category_summary"
            },
            { label: "Unknown", value: 1791936, __typename: "category_summary" }
          ]
        }
      }
    }
  ];
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TradeVolumesSpendType
        from={from}
        to={to}
        tokens={tokens}
        spendTypes={spendTypes}
        gender={gender}
        txType={txType}
      />
    </MockedProvider>
  );
});

it("should show loading", async () => {
  const component = render(
    <MockedProvider mocks={[]}>
      <TradeVolumesSpendType />
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
          <TradeVolumesSpendType
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
