/*global
history
*/
class NavigationHandler {
  constructor(currentTutorial, delegate) {
    this.tutorial = currentTutorial;
    this.delegate = delegate;
  }

  setup() {
    // default handler for any browser navigation events
    const handlerFn = (event) =>  {
      // Ensure that this handler is firing due to hashchange event
      // and not due to popstate event
      // http://stackoverflow.com/questions/9948510/hashchange-firing-popstate
      if (!event.state) {
        event.preventDefault();
        return false;
      }
      this.tutorial.end(true);
    }
    const hashChangeHandler = () => {
      if (!location.hash.length) {
        return;
      }
      this.tutorial.end(true);
    }

    // get custom eventHandler for each event
    const hashChangeFn = this.delegate.handleHashChange || hashChangeHandler;
    const popStateFn = this.delegate.handlePopState || handlerFn;
    const pushStateFn = this.delegate.handlePushState || handlerFn;
    const replaceStateFn = this.delegate.handleReplaceState || handlerFn;

    this._onHashChange(hashChangeFn);
    this._onPopState(popStateFn);
    this._onPushState(pushStateFn);
    this._onReplaceState(replaceStateFn);
  }

  _wrapFunction(origFn, fn) {
    // wrap the function with a tryInvoke call to call original function if one exists
    const self = this;

    return function() {
      const retval = self._tryInvokeWithArgs(origFn, arguments);
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
    const wrappedFn = this._wrapFunction(this.origReplaceState, fn);
    history.replaceState = wrappedFn;
  }

  _onPopState(fn) {
    this.origPopState = window.onpopstate;
    const wrappedFn = this._wrapFunction(this.origPopState, fn);
    window.onpopstate = wrappedFn;
  }

  _onPushState(fn) {
    this.origPushState = history.pushState;
    const wrappedFn = this._wrapFunction(this.origPushState, fn);
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
