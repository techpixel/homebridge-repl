<p align="center">
  <img src="https://user-images.githubusercontent.com/68567672/180891491-96b2efc1-4a0c-4648-b65e-577bff7c0fd2.png" height="150"/>
</p>

# homebridge-repl

Control your repls from Homekit via Homebridge. Currently in development.

![Screenshot of the Homebridge-repl Plugin in Homekit](Screenshot.png)

## Why?

Repl.it is a powerful online IDE that provides web-hosting capabilities. Now, you can manage your repl from Homekit utilizing this plugin.
 - Start your repl from any Apple device
 - Ask Siri to control your repl
 - Allow your repl to be integrated with Shortcuts

## Get started

1. **Find your connect.sid cookie**
    - Go to replit.com
    - DevTools > Application > Storage > Cookies > connect.sid 

2. **Find your repl's ID**
    - Use this [link](https://ally.furret.codes/replid)
    - OR Go to the repl's shell and enter `echo $REPL_ID`
    
3. **Install the plugin and edit the configuration**
    - Set "name", "token", and "replId" fields

4. Finished!

## Note
Running your repl manually while using this plugin is highly unstable.
 - ~~This plugin cannot detect if the repl has already started running~~
   - **New in v2.0.1** - Plugin can detect running repls
   - Current [bug](https://github.com/techpixel/homebridge-repl/issues/1) with this.
 - Most stable usage - use only from HomeKit
