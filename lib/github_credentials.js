const Configstore = require('configstore');
const pkg = require('../package.json')
const octokit = require('@octokit/rest')();
const _ = require('lodash');

const inquirer = require("./inquirer");

const conf = new Configstore(pkg.name);

module.exports = {
    getInstance: () => {
        return octokit;
    },
    
    githubAuth: (token) => {
        octokit.authenticate({
            type: 'oauth',
            token: token
        });
    },
    
    getStoredGithubToken: () => {
        return conf.get('github_credentials.token');
    },
    
    setGithubCrendeitals: async () => {
        const credentials = await inquirer.askGithubCredentials();
        octokit.authenticate(
            _.extend({
                type: 'basic'
            }, credentials)
        )
    },
    
    registerNewToken: async () => {
        // 该方法可能会被弃用，可以手动在github设置页面设置新的token
        try {
            const response = await octokit.oauthAuthorizations.createAuthorization({
                scope: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'git-repo-cli: register new token'
            });
            const token = response.data.token;
            if (token) {
                conf.set('github_credentials.token', token);
                return token;
            } else {
                throw new Error('Missing Token', 'Can not retrive token')
            }
        } catch(error) {
            throw error;
        }
    }
}