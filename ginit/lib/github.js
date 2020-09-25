const configStore = require("configstore");
const cli = require("clui");
const octokit = require("@octokit/rest");
const spinner = cli.Spinner; 
const { createBasicAuth } = require("@octokit/auth-basic");
const inquire = require("./inquirer");
const packageJson = require("../package.json");

const conf = new configStore(packageJson.name);

/**
 * we will exchange username and password for github token
 * we will use configStore to save the user
 * we will check if no token exist ? create new one : retrieve from storage
 */


module.exports = {
    // get instance of octokit
    getInstance: () => {
        return octokit;
    },

    // check for existence of github token from storage
    getStoredGitHubToken: () => {
        return conf.get("github.token");
    },

    getPersonalToken: async () => {
        const credentials = await inquire.askGitHubCredentials();
        // whilst waiting to authenticate the users, lets use clui to show a loading bar
        const spin = new spinner("Authenticating you.... Please wait");
        spin.start();
        // spin.stop()

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa() {
                spin.stop();
                const twoFactor = await inquire.get2FactorAuthentication();
                spin.start(); 
                return twoFactor.twoFactorAuthentication; 
            },
            token: {
                scopes: ["user", "public_repo", "repo", "repo:status"],
                note:
                    "ginit, the cmd developed by uppercase technologies for initializing git repos",
            },
        });

        try {
            const res = await auth();
            if (res.token) {
                conf.set("github.token", res.token);
                return res.token;
            } else {
                throw new Error("Github token was not found in the response ");
            }
        } finally {
            spin.stop();
        }
    },

    githubAuth: (token) => {
        octokit = new Octokit({
          auth: token
        });
      },
};
