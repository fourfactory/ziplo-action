const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs"); // Load the filesystem module

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
    //const filename = `${github.context.payload.repository.name}-${version}.tar.gz`;

    console.info(`Ziplo Action | Filename is ${filename}`);
    //console.info(`Ziplo Action | Execute tar command`);

    //const test = await exec.exec(`pwd`);
    //console.log("Current path = " + test);

    //await exec.exec(`tar -czvf ${filename} ./*`);
    //await exec.exec(`ls -l`);

    const stats = fs.statSync(`./${filename}`);

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
        'Content-Type': 'application/json'
      }
    });

    const dataInit = await resultInit.json();

    console.info(`Ziplo Action | Authorization OK : ${dataInit.body.token}`);
    console.info(`Ziplo Action | Upload on Cloud-Factory`);

    const bodyStorage = new FormData();
    const fileStream = fs.readFileSync(`./${filename}`);

    bodyStorage.append('file', fileStream, { knownLength: stats.size });
    bodyStorage.append('email', "github-actions@ziplo.fr");
    bodyStorage.append('source', "consignment");
    //bodyStorage.append('store', true);
    bodyStorage.append('versioningToken', dataInit.body.token);

    const resultUpload = await fetch(CloudFactoryApiHost + 'versioning/upload', {
      method: 'POST',
      body: bodyStorage,
      headers: {
        'authorization': organizationToken
      }
    });
    const dataUpload = await resultUpload.json();

    if (dataUpload.success === false) {
      core.setFailed(dataUpload.message);
      return false;
    }

    console.info(`Ziplo Action | Upload finished successfully`);

    const finalResult = JSON.stringify(dataUpload, undefined, 2)
    console.log(`The final Result: ${finalResult}`);

    core.setOutput("consignment-token", dataInit.body.token);

    console.info("Ziplo Action | End of action");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();