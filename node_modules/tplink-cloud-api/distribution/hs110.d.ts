/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
import hs100 from "./hs100";
export default class HS110 extends hs100 {
    constructor(tpLink: any, deviceInfo: any);
    getPowerUsage(): Promise<any>;
    getDayStats(year: any, month: any): Promise<any>;
    getMonthStats(year: any): Promise<any>;
}
