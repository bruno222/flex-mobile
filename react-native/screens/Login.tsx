import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const FLEX_SSO_URL = 'https://flex.twilio.com/prune-narwhal-3797'; // todo: move to env parameter

export const Login = function App({ setToken }: any) {
  let webview: any = null;

  /**
   * Example of "url":
   *   https://flex.twilio.com/?Expiration=2022-05-05T21%3A21%3A14Z&Identity=user-%2B4917672112233&Roles=supervisor&Token=eyJ6aXAiOiJEaaaAAZnBhO3Y9MSIsImVuYyI6IkEyNTZHQ00iLCJhbGciOiJkaXIiLCJ0d3IiOiJ1czEiLCJraWQiOiJTQVNfUzNfX19LTVNfdjEifQ..nxbQs0ycsTFH46EM.qYqlmVLrT949kzJOe1-AAAvJ-eL_rfGQzBUWIw2KxP_XKQu-CEiCzKAgn2BAY6YbwGuYx7JrPzTCnRgR36u3DumKRO4KXt9ILvHV2EwJBgyzAQ_87vZ4Y5Sd4z2ehTdM68J1WSRzaEkGEczUVmuEpjUCbybT8EU5qBpN9lm3O18r8JPw5YLf4NVYMAKuM63FNNHOKk9HfXl0F0mNd0d72DFmwogKc3gdo7khBFtEFv-p2LCLBKTER_ijdyywvoMu6g1ggg7Ok_qvlAglxlkN-DnYLRThd0m9NJrtx_a7zKbDV08ppJW8PDIvP2ORT7xWW32AVBhCjHTWWG3m-e1ZaAQKH3JGxpSdTd74yyM3Uf4sofP976QoNNsN8-xxxeNi3au5KkGNplUbXPbbuX3QN-Cq1NIKX2ytpzr7otI2rp6OvUKsgL1JZHa_7gfZYLU2beAMqEPuXvwghmro52rprXTcawdvqgJGv-k56TgpkFEZtHhxQxm3heRIbA88KpNIca_Hep69us5PITVrzSEY6pX2j-D9Cu-KWu67hbGzzn2EpWO4NCDqxjzlNt1J32MzE4ZO4iy8Bm3jNbLqMS2Y_8A5a5aZfYssfW4R-hKwjuV8gJym9UZ94NeWoIsAwE4G6IWPCGNrsNwrPsYEOmsDrZr_XhSZS9z0alAuefqLOCMZ5LdkmmYeHod3qEaB9OECrdywhoswk5nfmzVEbF41kxcRVErgJYVhS-iJ-oSuBVaoozd6OCZ-_R6w2ulRHr-vGcBlWs2_2lPDSVEX_0p72EDYde9QvkBmITwnSyHJGsNdHlzZ-cZ-TpMUGVY_eEp_OXbb_E_WInZCK9LcE1Lg7r1ocMN3L6jbYFpvQBqWwNdOtweo498dXcaeqllnG9F4Ts-eeFzjUFYmfQPs59S6eqNu7cWOgttb393LfZF2AO9WehDVQ1BhmHXisvhJ_yuOfbp827bLKQhY196IU5FIuv4pdaEWfEZEQ0DnQsS_nvAZANidh35Tnnwp6NPWNIeMmhVAvfWt2yDap1ClfbUHN32uGrahelcqNCeFvrFTaYndsmtUu7A-PVKnGsj6T0Pqyloy2ydpQz4JbkYlYLlLOReDSna4awWES2Sx8Z2f_Pu0GR8W84FBbH7Q-STQmk1jxTBmvvZ5asD2YHojNMya9g0PKAb14eebgha_vuZyBnuHAV8BnbOz-8BLiYndINg-LtwxsI1nyPNODTiOMxvYGMRi7GmmlETLMZFjKfdfBCya4H6PP88OgML4TDpNoQP1jKApxc96a6qqPrViiSdNIOOPDLBq1ojIaGKJcrX7cWlLvUelHA_Mm0Z3sDzkAoVh-W7Q-wIBwSuW9MVfXX1BoG2nCcBDQXmqBIDwoM0sktrthaeXHuUd7h5Fmac4qY6Ne-tWtgKxzKrp4A8Q3frOkl6H6gySj2ZDDD4GGxau1tWTxnSAgKCmks_LBUU90pP1wYZndNNKOVUdHO5IYvE76db4omDVRub_PUehqcu9g4JGfeGnQFdMWBzSYxyq0Gbdpnchy6vvx_8nmBngbejSb_JJHRoeiUo2NFjpYYfPsR0vgYzeZyaCSyQQZ_8wiVtETdFmz1E2hNcfrrhGg67tyACOaObrkAjVAj6Jp3ovvttnB1WTqAuCBPL_gx_vT7dP7nXPaa_gocQJ5V8h4h5iuA-uJL_NZZGDjDDWl7XTbjir-FrSd9PPQGHOSORtkMnhIitkFe9-VB2wdRKgKMVTsR5jzYQ6DYUHkxT9ouFQNvAYMbumleWSVS7AFPO54-d7FpB8uym5aQHje7MvfDIdrEMXp_LmZs3HreKxGDHjhLCjH7soqVfPACskUZW_QfeIdsQZsTZ4Q.klpoGTV4g9PCW3oRBH7AJA
   */
  const interceptor = ({ url }: any) => {
    if (!url.includes('Token=')) {
      return;
    }

    // Uhh, URLSearchParams does not work - Coding with stackoverflow:
    let regex = /[?&]([^=#]+)=([^&#]*)/g;
    let params: any = {};
    let match: any;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
      // console.log('param', match[1], match[2]);
    }
    const { Token } = params;

    // console.log('@@@params', params);
    // Expiration: "2022-05-05T21%3A43%3A49Z"
    // Identity: "user-%2B4917672899431"
    // Roles: "supervisor"
    // Token: "eyJ6aXAiOiJERUYiLCJjdHkiOiJ0d2lsaW8

    setToken(Token); // todo: do I have to build a token-renewal logic or taskrouter manages that?
    webview.stopLoading();
    return;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView ref={(ref) => (webview = ref)} source={{ uri: FLEX_SSO_URL }} style={styles.webview} onNavigationStateChange={interceptor} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webview: {
    // marginTop: 20,
    // maxHeight: 200,
    // width: 320,
    // flex: 1,
  },
});
