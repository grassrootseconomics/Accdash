import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import UsersSummary, { usersSummary } from "./UsersSummary";

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
        query: usersSummary,
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
          registeredUsers: [
            {
              total: 12418,
              start: 2183,
              end: 12418,
              __typename: "summary_tiles"
            }
          ],
          newRegisteredUsers: [
            { total: 10851, start: 616, end: 1660, __typename: "summary_tiles" }
          ],
          traders: [
            { total: 10188, start: 884, end: 3428, __typename: "summary_tiles" }
          ],
          frequentTraders: [
            { total: 126, start: 583, end: 606, __typename: "summary_tiles" }
          ],
          summaryDataBalance: [
            {
              value: [
                {
                  total: 6185433.0,
                  circulation: 6185433.0,
                  supply: 8000000.0,
                  reserve: 1990001.0,
                  price: 0.9950005
                }
              ],
              __typename: "time_summary"
            }
          ]
        }
      }
    }
  ];
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UsersSummary
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
      <UsersSummary />
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
      query: usersSummary,
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
          <UsersSummary
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
