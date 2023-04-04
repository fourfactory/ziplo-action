const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs"); // Load the filesystem module
const mime = require('mime-types')

const ziploApiHost = "https://api.dev.ziplo.fr/v1/";
const CloudFactoryApiHost = "https://ocs.dev.ziplo.fr/";

async function run() {
  try {
    console.info("Ziplo Action | Initialization");
    const organizationToken = core.getInput('organization-token');
    let version = core.getInput('version');
    let filepath = core.getInput('filepath');
    const now = new Date();

    if (typeof version !== 'string' || version?.length == 0) {
      version = [now.getFullYear, now.getMonth, now.getDay].join("-");
    }

    const filename = filepath === null ? `${github.context.payload.repository.name}-${version}.tar.gz` : filepath;

    console.info(`Ziplo Action | Filename is ${filename}`);

    const stats = fs.statSync(`./${filename}`);
    const mimeType = mime.lookup(filename);

    const body = {
      size: stats.size,
      filename: filename
    };

    console.info(`Ziplo Action | Call Ziplo to init upload`);

    const resultInit = await fetch(ziploApiHost + 'versioning/init', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'authorization': organizationToken,
        'Content-Type': 'application/json',
      }
    });

    const dataInit = await resultInit.json();

    if (dataInit.success === false) {
      core.setFailed(dataInit.message);
      return false;
    }

    console.info(`Ziplo Action | Authorization OK : ${dataInit.body.token}`);
    console.info(`Ziplo Action | Upload on Cloud-Factory`);

    const bodyStorage = new FormData();
    const fileBuffer = fs.readFileSync(`./${filename}`);

    bodyStorage.append('file', fileBuffer);
    bodyStorage.append('email', "github-actions@ziplo.fr");
    bodyStorage.append('source', "consignment");
    bodyStorage.append('versioningToken', dataInit.body.token);

    const resultUpload = await fetch(CloudFactoryApiHost + 'versioning/upload', {
      method: 'POST',
      body: bodyStorage,
      headers: {
        'authorization': organizationToken,
        'x-real-mime-type': mimeType
      }
    });
    const dataUpload = await resultUpload.json();

    console.log(bodyStorage);
    console.log(JSON.stringify(dataUpload));

    if (dataUpload.success === false) {
      core.setFailed(dataUpload.message);
      return false;
    }

    const resultConsignment = await fetch(ziploApiHost + 'versioning/create', {
      method: 'POST',
      body: JSON.stringify({
        uuid: dataUpload.body.fileId,
        filename: filename,
        contentType: dataUpload.body.mime,
        size: dataUpload.body.size,
        title: `Github Actions - ${filename}`,
        description: "Source code protected by Ziplo",
        container: dataUpload.body.containerId,
        checksum: dataUpload.body.checksum,
        store: true,
        versioning: dataInit.body.token
      }),
      headers: {
        'authorization': organizationToken,
        'Content-Type': 'application/json',
      }
    });
    const dataConsignment = await resultConsignment.json();

    if (dataConsignment.success === false) {
      core.setFailed(dataUpload.message);
      return false;
    }

    console.info(`Ziplo Action | Upload finished successfully`);

    //const finalResult = JSON.stringify({ upload: dataUpload, consignment: dataConsignment }, undefined, 2)
    //console.info(`The final Result: ${finalResult}`);

    core.setOutput("consignment-token", dataInit.body.token);

    console.info("Ziplo Action | End of action");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();