import {
    Accessory,
    AccessoryConfig,
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    HAP,
    Logging,
    Service
} from "homebridge";

// @ts-ignore
import { Crosis } from "@techpixel/crosis4furrets";

/*
 * IMPORTANT NOTICE
 *
 * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the "hap-nodejs" module).
 * The above import block may seem like, that we do exactly that, but actually those imports are only used for types and interfaces
 * and will disappear once the code is compiled to Javascript.
 * In fact you can check that by running `npm run build` and opening the compiled Javascript file in the `dist` folder.
 * You will notice that the file does not contain a `... = require("homebridge");` statement anywhere in the code.
 *
 * The contents of the above import statement MUST ONLY be used for type annotation or accessing things like CONST ENUMS,
 * which is a special case as they get replaced by the actual value and do not remain as a reference in the compiled code.
 * Meaning normal enums are bad, const enums can be used.
 *
 * You MUST NOT import anything else which remains as a reference in the code, as this will result in
 * a `... = require("homebridge");` to be compiled into the final Javascript code.
 * This typically leads to unexpected behavior at runtime, as in many cases it won't be able to find the module
 * or will import another instance of homebridge causing collisions.
 *
 * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `hap` property
 * of the api object, which can be acquired for example in the initializer function. This reference can be stored
 * like this for example and used to access all exported variables and classes from HAP-NodeJS.
 */
let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
    hap = api.hap;
    api.registerAccessory("ReplSwitch", ReplSwitch);
};

class ReplSwitch implements AccessoryPlugin {

    private readonly log: Logging;
    private readonly name: string;
    private switchOn = false;

    private readonly switchService: Service;
    private readonly informationService: Service;

    constructor(log: Logging, config: AccessoryConfig, api: API) {
        this.log = log;
        this.name = config.name;

        const client = new Crosis({
            token: config.token, // connect.sid
            replId: config.replId // id of a repl
        });

        this.switchService = new hap.Service.Switch(this.name);

        client.connect().then(() => {
            this.switchService.getCharacteristic(hap.Characteristic.On)
                .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => { // Get State
                    this.switchOn = client.shellState;

                    log.info("Current state of the switch was returned: " + (this.switchOn ? "ON" : "OFF"));
                    callback(undefined, this.switchOn);

                })
                .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => { // Set State

                    this.switchOn = value as boolean;

                    log.info("Requested switch state: " + (this.switchOn ? "ON" : "OFF"));

                    if (this.switchOn) {
                        this.startRunner(client);
                        callback(undefined, 1);
                    } else {
                        try {                        
                            client.shellExec('kill 1', undefined, 500).then(
                                () => { callback(undefined, 0) },
                                () => {
                                    callback(Error('Timed Out'), 1)
                                });
                        } catch (err) {
                            this.log("Encountered an error:\n", err)            
                        }
                    }

                });
        });

        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Replit")
            .setCharacteristic(hap.Characteristic.Model, "Repl");

        log.info("Switch finished initializing!");
    }

    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify(): void {
        this.log("Identify!");
    }

    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices(): Service[] {
        return [
            this.informationService,
            this.switchService,
        ];
    }

    // Start runner
    async startRunner(client: Crosis) {
        this.log("Starting runner...");
        try {
            client.shellRun().then(() => {
                this.log("Runner stopped...");
            });
        } catch (err) {
            this.log("Encountered an error:\n", err)
        }
  }

}