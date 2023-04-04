const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
import fetch from 'node-fetch';

const fs = require("fs"); // Load the filesystem module


const ziploApiHost = "https://api.dev.ziplo.fr/v1/";
const CloudFactoryApiHost = "https://ocs.dev.ziplo.fr/";

async function run() {
  try {
    console.info("Ziplo Action | Initialization");
    const organizationToken = core.getInput('organization-token');
    let version = core.getInput('version');
    const now = new Date();

    if (typeof version !== 'string' || string?.length == 0) {
      version = [now.getFullYear, now.getMonth, now.getDay].join("-");
    }

    const filename = `${github.context.payload.repository.name}-${version}.tar.gz`;

    exec.exec(`tar -czvf ${filename} ./*`);

    const stats = fs.statSync(filename);

    const body = {
      size: stats.size,
      filename: filename
    };

    const resultInit = await fetch(ziploApiHost + 'versioning/init', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'authorization': organizationToken,
        'Content-Type': 'application/json'
      }
    });

    const dataInit = await resultInit.json();

    const bodyStorage = {
      email: "github-actions@ziplo.fr",
      source: "consignment",
      store: true,
      versioningToken: dataInit.token
    };
    const resultUpload = await fetch(CloudFactoryApiHost + 'versioning/upload', {
      method: 'POST',
      body: JSON.stringify(bodyStorage),
      headers: {
        'authorization': organizationToken,
        'Content-Type': 'application/json'
      }
    });
    const dataUpload = await resultUpload.json();

    const finalResult = JSON.stringify(dataUpload, undefined, 2)
    console.log(`The final Result: ${finalResult}`);
    core.setOutput("consignment-token", dataInit.token);

    console.info("Ziplo Action | End of action");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();