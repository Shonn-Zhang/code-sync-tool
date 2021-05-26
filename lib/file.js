const fs = require('fs');
const path = require('path');

const directoryExists = (filePath) => {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch (err) {
        return false;
    }
};

const remove = (url) => {
    // console.log(url);
    // 读取原路径
    const STATUS = fs.statSync(url);
    // 如果原路径是文件
    if (STATUS.isFile()) {
        //删除原文件
        fs.unlinkSync(url);

        //如果原路径是目录
    } else if (STATUS.isDirectory()) {
        //如果原路径是非空目录,遍历原路径
        //空目录时无法使用forEach
        fs.readdirSync(url).forEach(item => {
            //递归调用函数，以子文件路径为新参数
            remove(`${url}/${item}`);
        });
        //删除空文件夹
        fs.rmdirSync(url);
    }
};

const move = (originalUrl, targetUrl) => {
    //复制原路径中所有
    copy(originalUrl, targetUrl);
    //删除原路径中所有
    // remove(originalUrl);
};

const create = (targetUrl) => {
    console.log('创建目标');
    // 判断目标路径是否存在
    if (directoryExists(targetUrl)) {
        remove(targetUrl)
    }
    try {
        fs.mkdirSync(`${targetUrl}`);
    }catch (e) {
        console.log(e);
    }
};


const copy = (originalUrl, targetUrl) => {
    // originalUrl = path.join(process.cwd(), originalUrl);
    // targetUrl = path.join(process.cwd(), targetUrl);

    // 判断目标路径是否存在
    if (!directoryExists(targetUrl)) {
        console.log('创建目标');
        try {
            fs.mkdirSync(`${targetUrl}`);
        }catch (e) {
            // console.log(e);
        }
    }

    try {
        // 读取原路径
        const STATUS = fs.statSync(originalUrl);
        // 获得原路径的末尾部分
        // 此部分亦可通过path模块中的basename()方法提取
        const fileName = originalUrl.split("/")[originalUrl.split("/").length - 1];
        // 如果原路径是文件
        if (STATUS.isFile()) {
            // 在新目录中创建同名文件，并将原文件内容追加到新文件中
            fs.writeFileSync(`${targetUrl}/${fileName}`, fs.readFileSync(originalUrl));

            //如果原路径是目录
        } else if (STATUS.isDirectory()) {
            //在新路径中创建新文件夹
            try {
                fs.mkdirSync(`${targetUrl}/${fileName}`);
            }catch (e) {
                // console.log(e);
            }
            //如果原路径是非空目录,遍历原路径
            //空目录时无法使用forEach
            fs.readdirSync(originalUrl).forEach(item => {
                //更新参数，递归调用
                copy(`${originalUrl}/${item}`, `${targetUrl}/${fileName}`);
            });
        }
        return true
    } catch (error) {
        console.log(error);
        console.log("路径有误" + error);
        return false
    }
}

module.exports = {
    getCurrentDirectoryBase: () => path.basename(process.cwd()),

    directoryExists: directoryExists,

    isGitRepository: () => {
        if (files.directoryExists('.git')) {
            console.log(chalk.red("Sorry! Can't create a new git repo because this directory has been existed"))
            process.exit();
        }
    },

    /**
     * @param {需删除的路径} url
     */
    remove: remove,


    /**
     * @param {原始路径} originalUrl
     * @param {目标路径} targetUrl
     */
    copy: copy,


    /**
     * 定义移动函数(由复制函数与删除函数组成)
     * @param {原始路径} originalUrl
     * @param {目标路径} targetUrl
     */
    move: move,
    create: create
};
