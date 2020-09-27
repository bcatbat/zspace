namespace zz.utils {
  /**打乱字符串 */
  export function upsetString(oStr: string) {
    let orginStr = oStr.split('');
    let len = orginStr.length;
    let result = '';
    let tmp;
    for (let i = len - 1; i > 0; i--) {
      let index = int(len * Math.random()); //随机数的产生范围不变
      //每次与最后一位交换顺序
      tmp = orginStr[index];
      orginStr[index] = orginStr[i];
      orginStr[i] = tmp;
    }
    for (let node of orginStr) {
      result += node;
    }
    return result;
  }
  /**字符串转unicode数字的累加和 */
  export function str2Unicode2Number(str: string) {
    let num = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      let strH = str.charCodeAt(i);
      num += +strH;
    }
    return num;
  }
  export function clamp(val: number, min: number, max: number) {
    if (val > max) return max;
    if (val < min) return min;
    return val;
  }
  export function randomInt(lowerValue: number, upperValue: number) {
    return Math.floor(Math.random() * (upperValue - lowerValue) + lowerValue);
  }
  export function randomIndex(len: number) {
    return randomInt(0, len);
  }
  export function randomIndexFromWeight(weightArr: number[]) {
    let tol = 0;
    weightArr.forEach(v => (tol += v));
    let rnd = Math.random() * tol;
    let acc = 0;
    let len = weightArr.length;
    for (let i = 0; i < len; i++) {
      acc += weightArr[i];
      if (rnd < acc) return i;
    }
    return -1;
  }
  export function randomItem<T>(arr: T[]): T {
    return arr[randomIndex(arr.length)];
  }
  export function convertArrayD2toD1<T>(arr: T[][]): T[] {
    let res: T[] = [];
    arr.forEach(v => {
      res.push(...v);
    });
    return res;
  }
  export function convertArrayD1toD2<T>(arr: T[], col: number): T[][] {
    let len = arr.length;
    if (len % col != 0) {
      throw new Error('传入的二维数组不合格');
    }
    let res: T[][] = [];
    for (let i = 0; i < len; i++) {
      res.push(arr.slice(i, i + col));
    }
    return res;
  }
  export function shuffleArray<T>(arr: T[]) {
    let len = arr.length;
    let res = Array.from(arr);
    for (let i = 0; i < len; i++) {
      let temp = res[i];
      let tar = randomIndex(len);
      res[i] = res[tar];
      res[tar] = temp;
    }
    return res;
  }
  /**格式化秒数,例如132s->02:12 */
  export function formatSeconds(seconds: number) {
    let min = int(seconds / 60).toFixed(0);
    let sec = (seconds % 60).toFixed(0);
    if (min.length == 1) min = '0' + min;
    if (sec.length == 1) sec = '0' + sec;
    return min + ':' + sec;
  }
  export function getPosInMainCamera(node: cc.Node) {
    let p_w = node.convertToWorldSpaceAR(cc.v2());
    let p_c = cc.Camera.main.node.convertToNodeSpaceAR(p_w);
    return p_c;
  }
  export async function instantiatePrefab(prefab: cc.Prefab | cc.Node) {
    return await new Promise<cc.Node>(resolve => {
      if (prefab instanceof cc.Prefab) {
        let node = cc.instantiate(prefab);
        resolve(node);
      }
      if (prefab instanceof cc.Node) {
        let node = cc.instantiate(prefab);
        resolve(node);
      }
    });
  }
  export async function getBundle(bundleName: string) {
    let bundle = cc.assetManager.getBundle(bundleName);
    if (!bundle) {
      bundle = await new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
        cc.assetManager.loadBundle(
          bundleName,
          (err: Error, bundle: cc.AssetManager.Bundle) => {
            err ? reject(err) : resolve(bundle);
          }
        );
      });
    }
    return bundle;
  }
  const TanOneEighthPi = Math.tan(Math.PI / 8);
  export function getDirectionOct(dir: {
    x: number;
    y: number;
  }): 'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW' {
    let x = dir.x;
    let y = dir.y;
    let t = TanOneEighthPi;
    let r1 = x + y * t;
    let r2 = x - y * t;
    if (r1 < 0 && r2 >= 0) return 'S';
    if (r1 >= 0 && r2 < 0) return 'N';

    let r3 = t * x + y;
    let r4 = t * x - y;
    if (r3 >= 0 && r4 >= 0) return 'E';
    if (r3 < 0 && r4 < 0) return 'W';

    let r5 = x + t * y;
    let r6 = x * t + y;
    if (r5 >= 0 && r6 < 0) return 'SE';
    if (r5 < 0 && r6 >= 0) return 'NW';

    let r7 = x - y * t;
    let r8 = x * t - y;
    if (r7 >= 0 && r8 < 0) return 'NE';
    if (r7 < 0 && r8 >= 0) return 'SW';

    throw new Error('计算方向时,出现错误');
  }
}

window.zz = zz;
