# mocha

在第一小结中的测试中用到了mocha框架，这一节就说说mocha框架吧。下面整理的内容主要来源于官网，如需了解更多请移步[mocha官网](https://mochajs.org/)

mocha是一个功能丰富的前端测试框架，mocha既可以基于Node.js环境运行也可以在浏览器环境运行。[项目地址](https://github.com/mochajs/mocha)

> Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on GitHub.

## 安装

安装有两种方式：1. 全局安装；2. 将mocha作为项目依赖模块安装。

```bash
npm install --global mocha
```

```bash
npm install --save-dev mocha
```

## 起步

初始化一个node项目

```bash
mkdir step1 && cd step1
npm init -y
npm install --save-dev mocha
```

创建一个文件夹 test, 并在里面创建一个 test.js ,写入下面的内容。

下面这段代码主要是简单测试了一下数组 `[1, 2, 3]` 的 `indexOf()` 方法。预期`[1, 2, 3].indexOf(4)`返回-1。

```javascript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

修改 package.json 文件。

```json
{
  "scripts": {
    "test": "mocha"
  }
}
```

然后打开终端，在命令行中运行`npm run test`, 下面是运行结果。

![image.png](https://upload-images.jianshu.io/upload_images/8532055-cda3b17994e3092c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 测试回调方法被多次调用

如果使用基于回调的异步测试，如果done（）被多次调用，则Mocha将抛出错误。这对于捕捉意外的双重回调很方便。

```javascript
it('double done', function(done) {
  // Calling `done()` twice is an error
  setImmediate(done);
  setImmediate(done);
});
```

回调多次意外运行错误结果

![image.png](https://upload-images.jianshu.io/upload_images/8532055-d002c9eff96da6dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 断言库

mocha允许你使用你想要的任何断言库。在上面的例子中，我们使用Node.js的内置断言模块 - 但通常，如果它抛出一个错误，它才有效果。因此也可以使用下面这些断言库:

+ [should.js](https://github.com/shouldjs/should.js)
+ [expect.js](https://github.com/Automattic/expect.js)
+ [chaijs](http://www.chaijs.com/)
+ [better-assert](https://github.com/tj/better-assert)
+ [unexpected.js](http://unexpected.js.org/)

## 异步代码检查

使用Mocha测试异步代码非常简单！只需在测试完成时调用回调。通过向它添加一个回调函数（通常名为done），Mocha会知道它应该等待这个函数被调用来完成测试。该回调接受Error实例（或其子类）或伪造值;其他任何事情都会导致测试失败。

```javascript
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
```

为了使事情更简单，done（）回调函数也接受一个Error实例（即新的Error（）），所以我们可以直接使用它：

```javascript
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});
```

## 运行Promise

或者，您可以不使用done（）回调，而是返回一个Promise。如果您正在测试的API返回Promise而不是回调，这很有用：

```javascript
beforeEach(function() {
  return db.clear()
    .then(function() {
      return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
});
```

## 使用 async/await

如果您的JS环境支持异步/等待，您也可以编写像这样的异步测试:

```javascript
beforeEach(async function() {
  await db.clear();
  await db.save([tobi, loki, jane]);
});

describe('#find()', function() {
  it('responds with matching records', async function() {
    const users = await db.find({ type: 'User' });
    users.should.have.length(3);
  });
});
```

## 测试同步的代码

在测试同步代码时，省略回调，mocha将自动继续下一次测试。

```javascript
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
```

## 箭头函数

不鼓励在 mocha 中使用箭头函数。 表达式中绑定的this，不能访问mocha上下文。例如，以下代码将失败：

```javascript
describe('my suite', () => {
  it('my test', () => {
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(1000);
    assert.ok(true);
  });
});
```

如果你不需要使用mocha的上下文，表达式是可以正常运行的。但是，如果最终需要重构，结果可能会与预期有所不同。

## 钩子

凭借其默认的“BDD”风格界面，Mocha提供了before（），after（），beforeEach（）和afterEach（）之前的钩子。这些应该用于设置先决条件并在测试后进行清理。

```javascript
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```

测试可以在你的钩子之前，之后或穿插出现。视情况而定，挂钩将按其定义的顺序运行;所有 **`before()`** 钩子运行(一次)，然后任何 **`beforeEach()`** 钩子，测试，任何 **`afterEach()`** 钩子，以及最后的 **`after()`** 钩子（一次）。

## 钩子描述

任何钩子都可以通过可选的描述来调用，从而更容易查明测试中的错误。如果钩子被赋予了一个命名函数，那么如果没有提供描述，将使用该名称。

```javascript
beforeEach(function() {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function() {
  // beforeEach:some description
});
```

## 异步钩子