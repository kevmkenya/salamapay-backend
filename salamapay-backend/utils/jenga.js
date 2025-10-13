const axios = require('axios');

async function getToken(base, key, secret) {
  const resp = await axios.post(`${base}/identity/v2/token`, {
    consumerKey: key,
    consumerSecret: secret
  });
  return resp.data.access_token;
}

async function disburse(base, token, payload) {
  const resp = await axios.post(`${base}/transaction/v2/remittance`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
}

module.exports = { getToken, disburse };
