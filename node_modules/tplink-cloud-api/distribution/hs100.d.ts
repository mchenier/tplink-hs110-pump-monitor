/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import device from "./device";
export default class HS100 extends device {
    constructor(tpLink: any, deviceInfo: any);
    powerOn(): Promise<any>;
    powerOff(): Promise<any>;
    setRelayState(state: any): Promise<any>;
    set_relay_state(state: any): Promise<any>;
    getScheduleRules(): Promise<any>;
    isOn(): Promise<boolean>;
    isOff(): Promise<boolean>;
    toggle(): Promise<any>;
    get_relay_state(): Promise<any>;
    getRelayState(): Promise<any>;
    getSysInfo(): Promise<any>;
}
