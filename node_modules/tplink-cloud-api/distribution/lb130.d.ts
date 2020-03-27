/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import lb100 from "./lb100";
export default class LB130 extends lb100 {
    constructor(tpLink: any, deviceInfo: any);
    setState(onOff: number, brightness?: number, hue?: number, saturation?: number): Promise<any>;
}
