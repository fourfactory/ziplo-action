const fetch = require('node-fetch');

const ziploApiHost = "https://api.ziplo.fr/v2";
const CloudFactoryApiHost = "https://storage.cloud-factory.fr/api/v3";

const reservation = async (organizationToken) => {
  return await fetch(ziploApiHost + '/modules/files/reservation/consignment', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${organizationToken}`,
      'x-agent': 'GITCLONING',
      'Content-Type': 'application/json',
    }
  })
};

const upload = async (uuid, bodyStorage) => {
  return await fetch(`${CloudFactoryApiHost}/upload/${uuid}`, {
    method: 'POST',
    body: bodyStorage,
  });
};

const consignment = async (organizationToken, referenceId) => {
  return await fetch(ziploApiHost + '/modules/gitcloning/consignment', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: referenceId
    }),
    headers: {
      'authorization': `Bearer ${organizationToken}`,
      'x-agent': 'GITCLONING',
      'Content-Type': 'application/json',
    }
  });
};

module.exports = {
  reservation,
  upload,
  consignment
};