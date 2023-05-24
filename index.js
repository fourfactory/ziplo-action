const core = require('@actions/core');
const github = require('@actions/github');
const FormData = require('form-data');
const fs = require("fs"); // Load the filesystem module

const apiService = require('./apiService');

async function run() {
  try {
    console.info("Ziplo Action | Initialization");
    const organizationToken = core.getInput('organization-token');
    const projectToken = core.getInput('project-token');
    let version = core.getInput('version');
    let filepath = core.getInput('filepath');
    const now = new Date();

    if (typeof version !== 'string' || version?.length == 0) {
      version = [now.getFullYear, now.getMonth, now.getDay].join("-");
    }

    const filename = filepath === null ? `${github.context.payload.repository.name}-${version}.tar.gz` : filepath;

    //console.info(`Ziplo Action | Filename is ${filename}`);
    console.info(`Ziplo Action | Call Ziplo to init upload`);

    const resultInit = await apiService.reservation(organizationToken, projectToken);

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

    const resultUpload = await apiService.upload(dataInit.body.uuid, bodyStorage);
    const dataUpload = await resultUpload.json();

    if (dataUpload.success === false) {
      core.setFailed(dataUpload.message);
      return false;
    }

    const resultConsignment = await apiService.consignment(organizationToken, projectToken, dataInit._id);
    const dataConsignment = await resultConsignment.json();

    if (dataConsignment.success === false) {
      core.setFailed(dataUpload.message);
      return false;
    }

    console.info(`Ziplo Action | Upload finished successfully`);

    core.setOutput("consignment_token", dataInit.body.token);

    console.info("Ziplo Action | End of action");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();