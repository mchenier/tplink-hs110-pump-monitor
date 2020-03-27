/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import device from "./device";
import hs100 from "./hs100";
import hs110 from "./hs110";
import hs200 from "./hs200";
import lb100 from "./lb100";
import lb130 from "./lb130";
export declare function login(user: string, passwd: string, termid?: string): Promise<TPLink>;
export default class TPLink {
    token: string;
    termid: string;
    deviceList: any[];
    constructor(token: string, termid?: string);
    getTermId(): string;
    getToken(): string;
    getDeviceList(): Promise<any[]>;
    newDevice(nameOrInfo: any): device;
    findDevice(alias: string): any;
    getHS100(alias: any): hs100;
    getHS110(alias: any): hs110;
    getHS200(alias: any): hs200;
    getLB100(alias: any): lb100;
    getLB110(alias: any): lb100;
    getLB120(alias: any): lb100;
    getLB130(alias: any): lb130;
}
