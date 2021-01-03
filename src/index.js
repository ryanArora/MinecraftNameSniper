const fs = require("fs");
const path = require("path");
const { question } = require("./util/userInput.js");
const convertObjectToArray = require("./util/convertObjectToArray.js");
const nameToProfile = require("./requests/nameToProfile.js");
const getNameHistory = require("./requests/getNameHistory.js");
const millisecondsToTime = require("./util/millisecondsToTime.js");
const changeName = require("./requests/changeName.js");

async function main() {
  const launcherProfilesPath = await question("Enter relative path to launcher profiles: ");
  let launcherProfiles = {};

  try {
    launcherProfiles = JSON.parse(fs.readFileSync(path.join(process.cwd(), launcherProfilesPath)));
  } catch (e) {
    console.error("Error: Invalid launcher profiles!");
    process.exit();
  }

  const accounts = convertObjectToArray(launcherProfiles.authenticationDatabase);

  console.log("The following accounts were found!\n");

  accounts.forEach((account, i) => {
    console.log(`${i}: ${account.username}`);
  });

  const i = parseInt((await question("\nEnter the number of the account that you want to snipe with: ")), 10);

  const accessToken = accounts[i].accessToken;
  
  if (!accessToken) {
    console.error("Error: No access token found!");
    process.exit();
  }

  const currentName = await question("Enter the current name of the person who's name you want to snipe: ");

  const args = process.argv.slice(2);

  nameToProfile(currentName, (err, profile) => {
    if (!profile) {
      console.error(err);
      process.exit();
    }

    const uuid = profile.id;

    getNameHistory(uuid, async (err, history) => {
      if (!history) {
        console.error(err);
        process.exit();
      }
      const lastNameChangeTimestamp = history[history.length - 1].changedToAt;

      if (!lastNameChangeTimestamp) {
        console.error("Error: Provided user doesn't have a name to snipe!");
        process.exit();
      }

      const ping = args[0] ? parseInt(args[0], 10) : 50;

      console.log(`Assuming ${ping} ping`);

      const avaliableAt = lastNameChangeTimestamp + 3196800000 - ping;
      let name = history[history.length - 2].name;

      const caps = await question(`Enter the name ${name} with the proper capitalization that you want: `);
      if (caps.toLowerCase() === name.toLowerCase()) {
        name = caps;
      }

      console.log(`Sniping ${name} in ${millisecondsToTime(avaliableAt - Date.now())}`);

      let done = false;

      setInterval(() => {      
        if (avaliableAt <= Date.now() && !done) {
          changeName(accessToken, name, (err, res) => {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", res);
              done = true;
            }
          });
        }
      }, 10);

    });
  });
}

main();
