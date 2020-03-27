/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import device from "./device";
export default class LB100 extends device {
    constructor(tpLink: any, deviceInfo: any);
    getState(): Promise<any>;
    isOn(): Promise<boolean>;
    isOff(): Promise<boolean>;
    powerOn(): Promise<any>;
    powerOff(): Promise<any>;
    toggle(): Promise<any>;
    transition_light_state(onOff: any, brightness: any): Promise<any>;
    protected setState(onOff: number, brightness?: number, unusued?: any, unusued2?: any): Promise<any>;
}
