#!/usr/bin/env node
const chalk = require('chalk'); // 多颜色显示
const clear = require('clear'); // 清空
const figlet = require('figlet'); // ASCII 文本显示
const commander = require('commander'); // 命令行接口

const file = require('../lib/file.js');
const pull = require('../lib/pull_modules');
const addexmodules = require('../lib/add_extra_modules');


// commander
//     .command('init')
//     .description('Hello world')
//     .action(() => {
//         clear();
//         // http://www.petsnet.cn/wp-content/uploads/2017/01/14c03d924b3a116ea72d3a3537c153a2.jpg
//         console.log(chalk.magenta(figlet.textSync('Commander Cli', {
//             hosrizontalLayout: 'full'
//         })));
//
//         file.create('./tempGitModules');
//         pull.setupRepo('./tempGitModules', 'http://gitlab.knx.com/x-galaxy/hunter.git')
//     });


commander
    .command('add')
    .description('拉取远程models到本地目录')
    .action(async (parse) => {
        clear();

        console.log(chalk.magenta(figlet.textSync('Commander Cli', {
            hosrizontalLayout: 'full'
        })));

        // 获取安装包name
        const modulesName = parse.args[0];
        if (!modulesName) {
            console.log('错误,未指定拉取的modelName');
            return
        }
        console.log(modulesName);

        // 配置
        const tempModulesPath = './tempGitModules';
        const targetModulesPath = './src/modules'; // 复制目标路径
        const source = 'http://gitlab.knx.com/x-galaxy/share-components.git'; // 仓库地址

        const hasModule = file.directoryExists('./src');
        if (!hasModule) {
            console.log('目标路径父级目录src不存在' + targetModulesPath);
            return
        }

        // 拉取远程代码
        file.create(tempModulesPath);
        await pull.setupRepo(tempModulesPath, source);

        // 判断是否有model
        if(!file.directoryExists(tempModulesPath + '/src/components/' + modulesName)){
            console.warn(new Date(), '远程modulesName不存在');
            file.remove(tempModulesPath);
            return
        }

        file.copy(tempModulesPath + '/src/components/' + modulesName, targetModulesPath);


        // 获取依赖包
        await addexmodules.get(targetModulesPath + '/' + modulesName);



        file.remove(tempModulesPath);

        console.log(chalk.magenta(figlet.textSync(`>>>`, {
            hosrizontalLayout: 'full'
        })));

        // const f = file.getCurrentDirectoryBase();
        // const hasModule = file.directoryExists('node_modules/'+ modulesName);
        // console.log(f);
        // console.log(hasModule);


        // if(!hasModule){ // module不存在则拉取
        // yarn.install
        // pull.setupRepo();
        // }
    });


// const github = require('./lib/gitub_credentials');

// commander.
//     command('check-token')
//     .description('Check user Github credentials')
//     .action(async () => {
//         let token = github.getStoredGithubToken();
//         if (!token) {
//             await github.setGithubCredentials();
//             token = await github.registryNewToken();
//         }
//         console.log(token);
//     });

commander
    .command('es')
    .description('Hello world')
    .action(() => {
        clear();
        // 验证文件引入model
        const {init, parse} = require('es-module-lexer');
        (async () => {
            // either await init, or call parse asynchronously
            // this is necessary for the Web Assembly boot
            await init;

            const source = `
            import b from './model/index/1.js';
            import c from './model/index/2.js';
            import { a } from 'asdf';
            export var p = 5;
            export function q () {};
            `;

            const [imports, exports] = parse(source);
            // exports[0] === 'p';
            // console.log(exports);
            // console.log(imports);
            // console.log(source.substring(imports[0].s, imports[0].e));

            const modelName = [];
            for (let i = 0; i < imports.length; i++) {
                let item = imports[i];
                let query = source.substring(item.s, item.e);
                if (query.indexOf('model') > -1) {
                    // console.log('>>',query);
                    modelName.push(query)
                }
            }
            console.log(modelName);

            const exec = require('child_process').exec;
            const cmdStr = 'npm -v';
            exec(cmdStr, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    console.warn(new Date(), '命令执行失败');
                } else {
                    console.log(stdout);
                    console.warn(new Date(), '命令执行成功');
                }
            });

        })();


        // console.log(is);
    });


commander.parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
