var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('数组中不包含当前值时，应当返回-1', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

// 多个回调执行
describe('mocha feature检查',() => {
  describe('回调 done() 方法多次执行检测', () => {
    it('double done', function(done) {
      // Calling `done()` twice is an error
      // setImmediate(done);
      setImmediate(done);
    });
  })
})
