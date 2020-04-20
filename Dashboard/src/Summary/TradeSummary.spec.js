import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import TradeSummary, { tradeSummary } from "./TradeSummary";

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
        query: tradeSummary,
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
          standard: [
            {
              tradeVolumes: {
                total: 24275259,
                start: 1108948,
                end: 3062964,
                __typename: "summary_tiles"
              },
              transactionCount: {
                total: 79384,
                start: 12073,
                end: 9604,
                __typename: "summary_tiles"
              },
              __typename: "subtype_summary"
            }
          ],
          disbursement: [
            {
              tradeVolumes: {
                total: 2807408,
                start: 101417,
                end: 0,
                __typename: "summary_tiles"
              },
              transactionCount: {
                total: 1989,
                start: 1719,
                end: 0,
                __typename: "summary_tiles"
              },
              __typename: "subtype_summary"
            }
          ],
          agent_out: [
            {
              tradeVolumes: {
                total: 1056117,
                start: 0,
                end: 529141,
                __typename: "summary_tiles"
              },
              transactionCount: {
                total: 148,
                start: 0,
                end: 22,
                __typename: "summary_tiles"
              },
              __typename: "subtype_summary"
            }
          ],
          reclamation: [
            {
              tradeVolumes: {
                total: 6319388,
                start: 207063,
                end: 378209,
                __typename: "summary_tiles"
              },
              transactionCount: {
                total: 19313,
                start: 720,
                end: 26,
                __typename: "summary_tiles"
              },
              __typename: "subtype_summary"
            }
          ]
        }
      }
    }
  ];
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TradeSummary
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
      <TradeSummary />
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
      query: tradeSummary,
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
          <TradeSummary
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
