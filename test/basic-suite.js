/*
@license https://github.com/t2ym/reportage/blob/master/LICENSE.md
Copyright (c) 2023 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
import { default as Suite, Config, chai, assert } from "./common-suite.js";
// basic scope
let scope = 'basic';
let basic = new Suite(scope, 'Basic Suite');
basic.htmlSuite = '/';
let CommonSuite;
basic.test = CommonSuite = Suite.scopes.common.classes.CommonSuite;
// test class mixin in "basic" scope
basic.test = (base) => class CheckAppType extends base {
  static get reconnectable() { return false; }
  get description() { return 'Check application type'; }
  async operation(_this) {
    this.skipPhase(_this);
    this.title = document.querySelector('title').innerText;
  }
  async checkpoint() {
    chai.assert.isOk([ 'Lit + JS', 'Lit + TS', 'React + TS' ].indexOf(this.title) >= 0, `${this.title} is running`);
  }
}
basic.test = (base) => class LitWaitForRendering extends base {
  get description() { return '[Lit] Button text is rendered'; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'Lit + TS' && this.title !== 'Lit + JS') _this.skip();
    let buttonText;
    let retry = 0;
    while (!buttonText) {
      try {
        buttonText = document.querySelector('my-app').shadowRoot.querySelector('[part=button]').innerText;
      }
      catch (e) {
        retry++;
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    if (retry > 0) {
      console.log(`WaitForRendering: retry = ${retry}`);
    }
  }
  async checkpoint() {
    chai.assert.isOk(document.querySelector('my-app').shadowRoot.querySelector('[part=button]').innerText.startsWith('count is '), 'Button text starts with "count is "');
  }
}
basic.test = (base) => class LitInitialCountIs0 extends base {
  get description() { return '[Lit] Button text is "count is 0"'; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'Lit + TS' && this.title !== 'Lit + JS') _this.skip();
    this.element = document.querySelector('my-app');
  }
  async checkpoint() {
    chai.assert.equal(this.element.count, 0, 'count property is 0');
    chai.assert.equal(this.element.shadowRoot.querySelector('[part=button]').innerText, `count is ${0}`, 'Initial button text is "count is 0"');
  }
}
basic.test = (base) => class LitIncrementCount extends base {
  get description() { return '[Lit] Click the button to increment the count'; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'Lit + TS' && this.title !== 'Lit + JS') _this.skip();
    this.element = document.querySelector('my-app');
    this.count = this.element.count;
    await this.forMutation(
      this.element.shadowRoot,
      async (target) => target.querySelector('[part=button]').innerText,
      async (target) => target.querySelector('[part=button]').click()
    );
  }
  async checkpoint() {
    chai.assert.equal(this.element.count, this.count + 1, `count property was incremented from ${this.count} to ${this.count + 1}`);
    chai.assert.equal(this.element.shadowRoot.querySelector('[part=button]').innerText, `count is ${this.count + 1}`, `Button text is "count is ${this.count + 1}"`);
  }
}
basic.test = (base) => class ReactWaitForRendering extends base {
  get description() { return '[React] Button text is rendered'; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'React + TS') _this.skip();
    let buttonText;
    let retry = 0;
    while (!buttonText) {
      try {
        buttonText = document.querySelector('.card > button').innerText;
      }
      catch (e) {
        retry++;
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    if (retry > 0) {
      console.log(`WaitForRendering: retry = ${retry}`);
    }
  }
  async checkpoint() {
    chai.assert.isOk(document.querySelector('.card > button').innerText.startsWith('count is '), 'Button text starts with "count is "');
  }
}
basic.test = (base) => class ReactInitialCountIs0 extends base {
  get description() { return '[React] Button text is "count is 0"'; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'React + TS') _this.skip();
    this.button = document.querySelector('.card > button');
  }
  async checkpoint() {
    chai.assert.equal(this.button.innerText, `count is ${0}`, 'Initial button text is "count is 0"');
    this.count = 0;
  }
}
basic.test = (base) => class ReactIncrementCount extends base {
  get description() { return `[React] Click the button to increment the count`; }
  async operation(_this) {
    this.skipPhase(_this);
    if (this.title !== 'React + TS') _this.skip();
    this.button = document.querySelector('.card > button');
    this.count = parseInt(this.button.innerText.split(' ')[2]);
    await this.forMutation(
      this.button,
      async (target) => target.innerText,
      async (target) => target.click()
    );
  }
  async checkpoint() {
    chai.assert.equal(this.button.innerText, `count is ${this.count + 1}`, `Button text is "count is ${this.count + 1}"`);
  }
}
/*
basic.test = (base) => class LitNavi extends base {
  get description() { return 'Navigate to Lit site'; }
  static get reconnectable() { return false; }
  async operation(_this) {
    this.stepPhase();
    if (this.currentPhase + 1 === this.phase) {
      console.log('LitNavi operation (deferred navigation)', this.phase, this.currentPhase);
      Object.assign(this.target, {
        phase: this.phase,
        deferredNavigation() {
          document.querySelector('my-app').shadowRoot.querySelector('a[id=lit-navi]').click();
        },
      });
    }
  }
  async checkpoint(_this) {
    this.skipPhase(_this);
    console.log('Checkpoint for LitNavi (deferred navigation)', this.phase, this.currentPhase, history.length, location.href);
    assert.equal(location.href, (new URL(`/external-navi-lit.html`, location.href)).href, 'Deferred navigation URL');
  }
}
*/
// scenarios
basic.test = {
  // test class mixins
  '': [
  ],
  // test classes
  CommonSuite: {
    CheckAppType: {
      LitWaitForRendering: {
        LitInitialCountIs0: {
          LitIncrementCount: {
            LitIncrementCount: 'LitClickButtonTwice; [Lit] Load and Click the button twice',
          },
        },
      },
      ReactWaitForRendering: {
        ReactInitialCountIs0: {
          ReactIncrementCount: {
            ReactIncrementCount: 'ReactClickButtonTwice; [React] Load and Click the button twice',
          },
        },
      },
    },
  },
};

export default Suite;
