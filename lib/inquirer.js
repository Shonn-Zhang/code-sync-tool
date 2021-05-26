const inquirer = require('inquirer');

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: "username",
                type: 'input',
                message: 'Enter your Github username or e-mail address:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your Github username:'
                    }
                }
            },
            {
                name: "password",
                type: 'password',
                message: 'Enter your password:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your Github username:'
                    }
                }
                
            }
        ];
        return inquirer.prompt(questions);
    },

    askRepositoryDetails: () => {
        const args = require('minimist')(process.argv.slice(2));
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Please enter a name for your repository:',
                default: args._[1] || files.getCurrentDirectoryBase(),
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a unique name for the repository.'
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: args._[2] || null,
                message: 'Now enter description:'
            },
            {
                type: 'input',
                name: 'visiblity',
                message: 'Please choose repo type',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];

        return inquirer.prompt(questions);
    },

    askIgnoreFiles: (filelist) => {
        const questions = [{
            type: 'checkbox',
            choices: filelist,
            message: 'Please choose ignore files'
        }];
        return inquirer.prompt(questions);
    }
}


