/* Example:
https://stackoverflow.com/questions/33193310/constr-applythis-args-in-es6-classes

class test {
    constructor(x, y, z) {
        console.log(x, y, z);
    }
}

ClassFactory.regClass('test', test);
ClassFactory.newInstance('test',[1,2,5])

*/
(function (win) {
    win.ClassFactory = {
        classDef: {},
        CLASSINDEX: 0,
        regClass: function (className, initFn) {
            this.classDef[className] = { initFn: initFn, index: this.CLASSINDEX };
            this.CLASSINDEX++;
        },
        newInstance: function (className, initArgs) {
            let cs = this.classDef[className];
            // 針對initArgs做一點容錯，有時initArgs只是一個物件，這時嘗試將他轉成arguments陣列丟入
            let args = Array.isArray(initArgs) ? initArgs : [initArgs];
            if (cs == null) throw Error(`Class:${className} Not Exist!`)
            return new cs.initFn(...args);
            // return new (Function.prototype.bind.apply(cs.initFn, [null].concat(initArgs)));
        }
    };
}(window))