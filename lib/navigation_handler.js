/*global
history
*/
class NavigationHandler {
  constructor(currentTutorial, delegate) {
    this.tutorial = currentTutorial;
    // default handler for any browser navigation events
    let handlerFn = () => currentTutorial.end(true);

    // get custom eventHandler for each event
    let hashChangeFn = delegate.handleHashChange || handlerFn;
    let popStateFn = delegate.handlePopState || handlerFn;
    let pushStateFn = delegate.handlePushState || handlerFn;
    let replaceStateFn = delegate.handleReplaceState || handlerFn;

    this._onHashChange(hashChangeFn);
    this._onPopState(popStateFn);
    this._onPushState(pushStateFn);
    this._onReplaceState(replaceStateFn);
  }

  _wrapFunction(origFn, fn) {
    // wrap the function with a tryInvoke call to call original function if one exists
    return () => {
      let retval = this._tryInvokeWithArgs(origFn, arguments);
      fn.apply(this, arguments);
      return retval;
    }
  }

  _tryInvokeWithArgs(fn, args, scope = window) {
    let retval = null;
    if (typeof fn === 'function') {
      retval = fn.apply(scope, args);
    }
    return retval;
  }

  _onHashChange(fn) {
    this.hashChangeListener = fn;
    window.addEventListener('hashchange', fn);
  }

  _onReplaceState(fn) {
    this.origReplaceState = history.replaceState;
    let wrappedFn = this._wrapFunction(this.origReplaceState, fn, history);
    history.replaceState = wrappedFn;
  }

  _onPopState(fn) {
    this.origPopState = window.onpopstate;
    let wrappedFn = this._wrapFunction(this.origPopState, fn);
    window.onpopstate = wrappedFn;
  }

  _onPushState(fn) {
    this.origPushState = history.pushState;
    let wrappedFn = this._wrapFunction(this.origPushState, fn, history);
    history.pushState = wrappedFn;
  }

  tearDown() {
    window.onpopstate = this.origPopState;
    this.origPopState = null;

    history.replaceState = this.origReplaceState;
    this.origReplaceState = null;

    history.pushState = this.origPushState;
    this.origPushState = null;

    if (this.hashChangeListener) {
      window.removeEventListener('hashchange', this.hashChangeListener);
      this.hashChangeListener = null;
    }
  }
}

export default NavigationHandler;
