<p align="center">
  <img src="https://user-images.githubusercontent.com/68567672/180891491-96b2efc1-4a0c-4648-b65e-577bff7c0fd2.png" height="150"/>
</p>

# homebridge-repl

Control your repls from Homekit via Homebridge. Currently in development.

![output](https://user-images.githubusercontent.com/68567672/181356714-981657db-454f-4d90-ac6c-0e52159214e0.gif)

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
    - Go to the repl's shell and enter `echo $REPL_ID`
    
3. **Install the plugin and edit the configuration**
    - Set "name", "token", and "replId" fields

4. Finished!

## Note
Running your repl manually while using this plugin is highly unstable.
 - This plugin cannot detect if the repl has already started running
 - Use only when your repl is finished
 - In case you edit or run your repl manually, restart Homebridge to ensure operation.
