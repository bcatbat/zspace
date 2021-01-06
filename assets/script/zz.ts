import * as zz from './index';
/**不要在内部(包括各种manager,model中)引用zz */
window['zz'] = zz;
export { zz };
