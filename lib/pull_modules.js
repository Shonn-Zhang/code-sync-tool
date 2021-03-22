const git = require('simple-git');
// const git = require('simple-git/promise');
const fs = require('fs');
const path = require('path');
const file = require('./file.js');

// const GIT_REPOSITORY_ROOT = 'tempModules'


module.exports = {
	setupRepo: async (gitRootPath, url) => {
		const simpleGit = git(gitRootPath);
        try {
            await simpleGit.init().addRemote('origin', url).pull('origin', 'master')
                // .add('.gitignore')
                // .add('./*')
                // .commit('Initial commit')
                // .checkout('master');
                // .push('origin', 'master')
            // echo "devops" >> .git/info/sparse-checkout
            // console.log(process.cwd());
            // if(file.directoryExists('testModules')){
            // 	console.log('存在');
            // 	fs.writeFileSync(path.join(process.cwd(),'./testModules/.sparse-checkout'), 'src');

            // await git
            //     // init()
            //     // .add('.gitignore')
            //     // .add('./*')
            //     // .commit('Initial commit')
            //     // .addRemote('origin', 'https://github.com/steveukx/git-js.git')
            //     .pull('origin', 'master')
            // }else{
            // 	fs.mkdirSync(path.join(process.cwd(),'./testModules'));
            // }

			// await git.clone('http://gitlab.knx.com/x-galaxy/share-components.git','./testModules');

            return true;


        } catch (err) {
            throw err;
        }
    }
}
