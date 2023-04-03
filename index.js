const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const ziploApiHost = "https://api.dev.ziplo.fr/v1/";
const CloudFactoryApiHost = "https://ocs.dev.ziplo.fr/";

try {
  const organizationToken = core.getInput('organization-token');
  console.info("Ziplo Action | Initialization");

  console.log(github.context.payload.repository.name);

  //exec.exec(`tar -czvf ${github.context.payload.repository.name}-${github.context.eventName}.tar.gz`)

  const time = (new Date()).toTimeString();
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  core.setOutput("consignment-token", '0123456789ABCDEF');

  console.info("Ziplo Action | End of action");
} catch (error) {
  core.setFailed(error.message);
}