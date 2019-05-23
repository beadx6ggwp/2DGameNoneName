var ResManager = {
    defTypes: {},
    res: {},
    regResType: function (type, clz) {
        if (!this.defTypes[type]) {
            this.defTypes[type] = clz;
        }
    },
    getClass: function (type) {
        return this.defTypes[type];
    },
    addRes: function (resObj) {
        this.res[resObj.type] = this.res[resObj.type] || {};
        this.res[resObj.type][resObj.name] = resObj;
    },
    clearRes: function () {
        this.res = {};
    },
    getResByName: function (type, name) {
        return this.res[type][name];
    },
    load: function (type, name, src, loadedFN) {
        let t1 = this.getClass(type);
        let resObj = this.getClass(type).load(name, src, loadedFN);
        this.addRes(resObj);
        return resObj;
    },
    loadResConfig: function (url, loadingFN, loadedFN) {
        let self = this;
        loadJSON(url, (e, xobj) => {
            let res = JSON.parse(xobj.responseText);
            self.parseRes(res, loadingFN, loadedFN);
        });
    },
    parseRes: function (res, loadingFN, loadedFN) {
        let datas = [];
        for (i in res) {
            for (const data of res[i]) {
                datas.push({ type: i, name: data.name, src: data.src });
            }
        }
        let totalCount = datas.length;
        let loadedCount = 0;
        let currLoadObj = null, data = null;
        let self = this;
        let loadHand = window.setInterval(() => {
            if (!currLoadObj) {
                data = datas.shift();
                currLoadObj = self.load(data.type, data.name, data.src);
                return;
            }

            if (currLoadObj.isLoaded) {
                loadedCount++;
                loadingFN && loadingFN(loadedCount, totalCount, currLoadObj);
                if (loadedCount == totalCount) {
                    window.clearInterval(loadHand);
                    loadedFN && loadedFN(self);
                    return;
                }
                data = datas.shift();
                currLoadObj = self.load(data.type, data.name, data.src);
            }
        });
    }
}

// 要整合成抽象Class Loader，讓其他載入方式更好繼承
// 加入get()註冊，讓各種資料個好取得

var ImageRes = {
    TypeName: 'image',
    load: function (name, url, loadedFN) {
        let img = new Image();
        let resObj = createResObj('image', name, url, img, false);

        img.onload = (e) => {
            resObj.isLoaded = true;

            loadedFN && loadedFN(e, resObj.data);
        };
        img.onerror = (e) => {
            console.log('load error', name, e);
        };
        img.src = url;

        return resObj;
    }
}
var FrameRes = {
    TypeName: 'frame',
    load: function (name, url, loadedFN) {
        let frame = {};
        let resObj = createResObj('frame', name, url, frame, false);
        let self = this;
        loadJSON(url, (e, xobj) => {
            resObj.isLoaded = true;
            let datas = JSON.parse(xobj.responseText);
            for (frame in datas) {
                resObj.data[frame] = self.parseToAnimation(datas[frame]);
            }

            loadedFN && loadedFN(e, resObj.data);
        });

        return resObj;
    },
    parseToAnimation(data) {
        let type = data['type'];
        let img = ResManager.getResByName(ImageRes.TypeName, data['imgName']).data;
        let animGroup = new AnimationGroup();
        if (type == 0) {
            let frames = new Frames('def', img, 0);
            frames.add(0, 0, img.width, img.height);
            animGroup.add('def', frames);
            return animGroup;
        }

        let animations = data['animations'];
        let fw = data['frameWidth'];
        let fh = data['frameHeight'];
        let cols = img.width / fw;
        if (type == 1) {
            if (animations) {
                for (animName in animations) {
                    let dur = animations[animName]['duration'];
                    let seq = animations[animName]['sequence'];
                    let frames = new Frames(animName, img, dur);

                    if (seq.indexOf('-') != -1) {
                        let numarr = seq.split('-');
                        let startFrame = Number(numarr[0]);
                        let endFrame = Number(numarr[1]);

                        for (let index = startFrame; index <= endFrame; index++) {
                            let x = (index % cols) | 0;
                            let y = (index / cols) | 0;
                            frames.add(x * fw, y * fh, fw, fh);
                        }
                    } else {
                        let arr = seq.split(',');
                        for (const index of arr) {
                            let x = (index % cols) | 0;
                            let y = (index / cols) | 0;
                            frames.add(x * fw, y * fh, fw, fh);
                        }
                    }
                    animGroup.add(animName, frames);
                }
            }
            return animGroup;
        }
    }
}

ResManager.regResType(ImageRes.TypeName, ImageRes);
ResManager.regResType(FrameRes.TypeName, FrameRes);

function createResObj(type, name, src, data, isLoaded) {
    return {
        type: type,
        name: name,
        src: src,
        data: data,
        isLoaded: isLoaded
    };
}




function getJSON(src) {
    loadJSON(src, function (xobj) {
        console.log(JSON.parse(xobj));
    });
}
function loadJSON(src, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', src, true);
    xobj.onreadystatechange = function (e) {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(e, xobj);
        }
    };
    xobj.send(null);
}