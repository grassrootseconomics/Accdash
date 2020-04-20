import { MockedProvider, wait } from "@apollo/react-testing";
import React from "react";
import { render, findByText, act } from "@testing-library/react";
import Traders, { summaryQuery } from "./Traders";

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
          summaryDataTopTraders: [
            {
              value: [
                {
                  source: "0xf7ab48c172f7b233e2b973d723612e52013cc058",
                  s_gender: "Female",
                  s_business_type: "Farming/Labour",
                  volume: 776996.14445522,
                  count: 2245
                },
                {
                  source: "0x61c2c1d9235bc56e225de54aeff06b0b403a2a9f",
                  s_gender: "Female",
                  s_business_type: "Farming/Labour",
                  volume: 707866.385563834,
                  count: 1974
                },
                {
                  source: "0xe3208eae59b4cd48bc99178a6fcf2308d72986b4",
                  s_gender: "Female",
                  s_business_type: "Farming/Labour",
                  volume: 595344.125067598,
                  count: 743
                },
                {
                  source: "0x890755d6d2a519a31270cbc1d6c8af4390b61d9b",
                  s_gender: "Male",
                  s_business_type: "Shop",
                  volume: 514018.0,
                  count: 231
                },
                {
                  source: "0xf06ac4987c985587aa4de713efe77588e5d17e70",
                  s_gender: "Female",
                  s_business_type: "Savings Group",
                  volume: 483106.238679384,
                  count: 246
                },
                {
                  source: "0x1a232a155023c82fa06f2700ec0be6857c5ce40c",
                  s_gender: "Male",
                  s_business_type: "Food/Water",
                  volume: 401934.0,
                  count: 459
                },
                {
                  source: "0x3bc77cfcccb00ab17a1e6f980c31441b5581e5bd",
                  s_gender: "Female",
                  s_business_type: "Shop",
                  volume: 323729.063130046,
                  count: 296
                },
                {
                  source: "0x72be79d1e8fccd901c832ecf490d81e9f7beefc3",
                  s_gender: "Male",
                  s_business_type: "Shop",
                  volume: 304086.940717095,
                  count: 157
                },
                {
                  source: "0xd687038626a49d9b25cbbedf5dfdede9772e2fb5",
                  s_gender: "Female",
                  s_business_type: "Savings Group",
                  volume: 296633.0,
                  count: 118
                },
                {
                  source: "0x03eb6856cf2fb95fb6458dbbd57c83028572be3d",
                  s_gender: "Female",
                  s_business_type: "Savings Group",
                  volume: 257826.0,
                  count: 67
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
        <Traders
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
      <Traders />
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
          <Traders
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
