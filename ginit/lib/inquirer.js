/**
 * ask users for their github username and password in an interactive mode
 * and take the input similar to html form
 * using inquirer
 */

const inquirer = require("inquirer");
const file = require("./file");
module.exports = {
    // prompt user to enter github credentials
    askGitHubCredentials: () => {
        const questions = [
            {
                name: "username",
                type: "input",
                message: "Please enter your github username or email",
                validate: value => {
                    return value.length ? true : "Please enter your github username and email ";
                },
            },
            {
                name: "password",
                type: "password",
                message: "Please enter your password",
                validate: value => {
                    return value.length ? true : "Please provide your password";
                },
            },
        ];

        return inquirer.prompt(questions);
    },

    // in case user has enabled 2factor auth on their github account
    get2FactorAuthentication: () => {
        return inquirer.prompt({
            name: "twoFactorAuthentication",
            type: "input",
            message: "Please enter your two factor authentication code ",
            validate: value => {
                return value.length ? true : "Please enter your two factor authentication code ";
            },
        });
    },

    // ask user to provide details for their repo
    askRepoDetails: () => {
        const argv = require("minimist")(process.argv.slice(2));

        const questions = [
            {
                name: "repoName",
                type: "input",
                message: "Please enter your repo name ",
                default: argv._[0] || file.getCurrentDirectoryBase(),
                validate: value => {
                    return value.length ? true : "Please enter your repo name ";
                },
            },
            {
                name: "description",
                type: "input",
                message: "Please enter an optional description for your repository",
                default: argv._[1] || null,
                validate: value => {
                    return value.length
                        ? true
                        : "Please enter an optional description for your repository";
                },
            },
            {
                type: "list",
                name: "visibility",
                message: "Public or private",
                choices: ["public", "private"],
                default: "public",
            },
        ];

        return inquirer.prompt(questions);
    },

    askIgnoreFiles: fileList => {
        const questions = [
            {
                type: "checkbox",
                name: "ignore",
                message: "Select the files and/or folders you want to ignore ",
                choices: fileList,
                default: ["node_modules", "bower_components", ".env"],
            },
        ];

        return inquirer.prompt(questions);
    },
};
