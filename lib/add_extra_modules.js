const fs = require('fs');
const path = require('path');
const file = require('./file.js');
const {init, parse} = require('es-module-lexer');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const file_parse = async (fileString) => {
    // either await init, or call parse asynchronously
    // this is necessary for the Web Assembly boot
    await init;

    // const source = `
    //     import b from './model/index/1.js';
    //     import c from '@kne/antd-enhance';
    //     import { a } from 'asdf';
    //     export var p = 5;
    //     export function q () {};
    //     `;

    const source = fileString;
    // console.log(source);

    const [imports, exports] = parse(source);
    // exports[0] === 'p';
    // console.log(exports);
    console.log(imports);
    // console.log(source.substring(imports[0].s, imports[0].e));

    const modelName = [];
    for (let i = 0; i < imports.length; i++) {
        let item = imports[i];
        let query = source.substring(item.s, item.e);
        console.log(query);
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

};

const fileParse = (source) => {

    // const source = `
    //     import b from './model/index/1.js';
    //     `;

    const ast = parser.parse(source, {
        sourceType: "module",
        plugins: ["dynamicImport", "jsx"]
    });

    const modelName = [];
    const packagesName = [];
    const Judge = (value) => {
        if (value.indexOf('./') > -1 || value.indexOf('../') > -1) {
            // console.log(value);
            return
        }

        if (value.indexOf('@modules') > -1) {
            modelName.push(value);
        }

        const pkg = hasPkg(value);
        if (pkg) {
            packagesName.push(value + pkg);
        }

    };

    traverse(ast, {
        enter(path) {
            // console.log('\n\n\n\n\n\n\n\n\n', path.node);
            const node = path.node;
            //判断当前语法节点是否是require或import语句
            if (node.type === 'CallExpression' && node.callee && (node.callee.name === 'require' || node.callee.type === 'Import')) {
                // modelName.push(node.arguments[0].value);
                Judge(node.arguments[0].value);
            } else if (node.type === "ImportDeclaration") {
                // modelName.push(node.source.value);
                Judge(node.source.value);
            }
        }
    });


    console.log(modelName);
    console.log(packagesName);
    return modelName
}


/**
 * 判断是否安装了某个包
 * @param {string} pkg 包名
 */
const hasPkg = pkg => {
    //process.cwd(),
    const pkgPath = path.join('./tempGitModules', `package.json`);
    const pkgJson = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
    const {dependencies = {}, devDependencies = {}} = pkgJson;
    // console.log(dependencies);
    return dependencies[pkg];
    // || devDependencies[pkg];
}


module.exports = {
    get: async (originalUrl) => {

        // try {
        const fileString = fs.readFileSync(originalUrl + '/index.js', 'utf8')
        // console.log(fileString);
        // 验证文件引入model
        const modelName = await fileParse(fileString);
        const exec = require('child_process').exec;

        for (let i = 0; i < modelName.length; i++) {

            // if (hasPkg(modelName[i])){
            //     console.log('已安装');
            //     break;
            // }

            // const cmdStr = `yarn add ${modelName[i]} -S`;
            // exec(cmdStr, (err, stdout, stderr) => {
            //     if (err) {
            //         console.log(err);
            //         console.warn(new Date(), '命令执行失败');
            //     } else {
            //         console.log(stdout);
            //         console.warn(new Date(), '安装依赖成功');
            //     }
            // });
        }

        // } catch (e) {
        //     console.warn('拉取远程包成功,但读取module依赖失败');
        //     return
        // }
    }
}
