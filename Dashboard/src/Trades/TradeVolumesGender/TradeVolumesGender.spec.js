import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import TradeVolumesGender, { summaryQuery } from "./TradeVolumesGender";

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
              label: "Female",
              value: 14449964,
              __typename: "category_summary"
            },
            { label: "Male", value: 9825295, __typename: "category_summary" }
          ]
        }
      }
    }
  ];
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TradeVolumesGender
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
      <TradeVolumesGender />
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
          <TradeVolumesGender
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
