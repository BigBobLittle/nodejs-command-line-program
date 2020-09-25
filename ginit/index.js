#!/usr/bin/env node 

/**
 * this project is intended as a practice of building a node command line tool 
 * the tool will be used to create a github repo, commit, ignore files for projects 
 * chalk — colorizes the output
clear — clears the terminal screen
clui — draws command-line tables, gauges and spinners
figlet — creates ASCII art from text
inquirer — creates interactive command-line user interface
minimist — parses argument options
configstore — easily loads and saves config without you having to think about where and how.
 */


const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const files = require("./lib/file");
const github = require('./lib/github');
const fs = require('fs')

clear();

//display a banner
console.log(chalk.red(figlet.textSync("Uppercase Technologies", { horizontal: "full" })));

// check if .git folder exist in root folder 
if (files.directoryExists(".git")) {
    console.log(chalk.red("Already a git repository"));
    process.exit();
}


// test inquirer 

// const run = async() => {
//     let creds = github.getStoredGitHubToken();

//     if(!creds){
//       creds = await github.getPersonalToken();
//     }
//     console.log(creds);
// }

// run()

const run = async () => {
    try {
      // Retrieve & Set Authentication Token
      const token = await getGithubToken();
      github.githubAuth(token);
  
      // Create remote repository
      const url = await repo.createRemoteRepo();
  
      // Create .gitignore file
      await repo.createGitignore();
  
      // Set up local repository and push to remote
      await repo.setupRepo(url);
  
      console.log(chalk.green('All done!'));
    } catch(err) {
        if (err) {
          switch (err.status) {
            case 401:
              console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
              break;
            case 422:
              console.log(chalk.red('There is already a remote repository or token with the same name'));
              break;
            default:
              console.log(chalk.red(err));
          }
        }
    }
  };


const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if(token) {
      return token;
    }
  
    // No token found, use credentials to access GitHub account
    token = await github.getPersonalAccesToken();
  
    return token;
  };