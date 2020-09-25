
const github = require('./github');
const inquirer = require('./inquirer');
const spinner = require('clui').Spinner; 
const fs = require('fs');
const touch = require('touch')
const git = require('simple-git/promise')();
module.exports = {

    //create remote project 
    createRemoteRepo: () => {
    const gh = github.getInstance(); 
     const createRepo = await inquirer.askRepoDetails(); 

     const data = {
         name: createRepo.repoName,
         description: createRepo.description,
         private: (answers.visibility === 'private')
     }

     const spin = new spinner('Creating your repo'); 
     spin.start();

     try{
        const create = await gh.repos.createForAuthenticatedUser(data);
        return create.data.ssh_url; 
     } finally{
         spin.stop();
     }
   
    },


    askIgnoreFiles: () => {

        // list all files and folders in current working directory without the git and git ignore folders
        const fileList = fs.readdirSync('.').filter(x => !['.git', '.gitignore'].includes(x));

        if(fileList.length){
            const answers = await inquirer.askIgnoreFiles(fileList);
           
                answers.ignore.length?  fs.writeFileSync('.gitignore', answers.ignore.join('\n')) :  touch('.gitignore')
           
        }else{
          touch('.gitignore')
        }
    },

    setupRepo: async (url) => {
        const status = new Spinner('Initializing local repository and pushing to remote...');
        status.start();
      
        try {
          git.init()
            .then(git.add('.gitignore'))
            .then(git.add('./*'))
            .then(git.commit('Initial commit'))
            .then(git.addRemote('origin', url))
            .then(git.push('origin', 'master'));
        } finally {
          status.stop();
        }
      },
}