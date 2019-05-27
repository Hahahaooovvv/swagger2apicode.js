// 引入依赖
var program = require('commander');
import GetData from './app';
import { GetArgv } from './utils/processHelper';

// 定义版本和参数选项
program
    .version('0.1.0', '-v, --version')
    .option('-i, --init', '解析swagger地址')

// 必须在.parse()之前，因为node的emit()是即时的
program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    this is an example');
    console.log('');
});

program.parse(process.argv);


if (program.init) {
    // url fileName outDir rc
    const argv = GetArgv(process.argv);
    console.log(process.argv)
    console.log(argv)
    if (!argv.url) {
        console.log("请输入swagger地址");
    }
    else {
        GetData(argv.url, argv.rc || "request", argv.outDir || "./", argv.fileName || null);
    }
}
