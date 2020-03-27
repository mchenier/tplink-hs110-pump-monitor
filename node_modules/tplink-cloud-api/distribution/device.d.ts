/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import tplink from "./tplink";
export interface TPLinkDeviceInfo {
    fwVer: string;
    alias: string;
    status: number;
    deviceId: string;
    role: string;
    deviceMac: string;
    deviceName: string;
    deviceType: string;
    deviceModel: string;
    appServerUrl: string;
}
export default class TPLinkDevice {
    genericType: string;
    device: TPLinkDeviceInfo;
    private params;
    constructor(tpLink: tplink, deviceInfo: TPLinkDeviceInfo);
    readonly firmwareVersion: string;
    readonly role: string;
    readonly mac: string;
    readonly model: string;
    readonly type: string;
    readonly name: string;
    readonly disconnected: boolean;
    readonly connected: boolean;
    readonly status: number;
    readonly humanName: string;
    readonly alias: string;
    readonly id: string;
    getDeviceId(): string;
    readonly appServerUrl: string;
    getSystemInfo(): Promise<any>;
    tplink_request(command: any): Promise<any>;
    passthroughRequest(command: any): Promise<any>;
}
