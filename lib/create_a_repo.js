// create_a_repo.js
const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')();

const inquirer = require('./inquirer');
const gh = require('./github_credentials');

module.exports = {
    createRemoteRepository: async () => {
        const github = gh.getInstance(); // 获取octokit实例
        const answers = await inquirer.askRepositoryDetails();
        const data = {
            name: answers.name,
            descriptions: answers.description,
            private: (answers.visibility === 'private')
        };

        try {
            // 利用octokit 来新建仓库
            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.ssh_url;
        } catch (error) {
            throw error;
        }
    },

    createGitIgnore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);
            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                touch('.gitnore');
            }
        } else {
            touch('.gitignore');
        }
    },

    setupRepo: async (url) => {
        try {
            await git.
                init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url)
                .push('origin', 'master')
            return true;
        } catch (err) {
            throw err;
        }
    }
}