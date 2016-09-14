//
//  InterfaceController.swift
//  Watch Extension
//
//  Created by Jordan Byron on 1/2/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import WatchKit
import Foundation
import WatchConnectivity

class InterfaceController: WKInterfaceController, WCSessionDelegate {
  
  fileprivate let session : WCSession? = WCSession.isSupported() ? WCSession.default() : nil
  
  @IBOutlet var garageDoorStatusLabel: WKInterfaceLabel!
  @IBOutlet var garageDoorButton: WKInterfaceButton!
  @IBOutlet var alarmStatusLabel: WKInterfaceLabel!
  @IBOutlet var lastUpdatedLabel: WKInterfaceLabel!
  
  @IBAction func garageDoorButtonPressed() {
    sendMessage(["garageDoor": "toggle" as AnyObject])
  }
  
  @IBAction func alarmStayMenuPressed() {
    sendMessage(["alarm": "stay" as AnyObject])
  }
  
  @IBAction func alarmAwayMenuPressed() {
    sendMessage(["alarm": "away" as AnyObject])
  }
  
  @IBAction func alarmOffMenuPressed() {
    sendMessage(["alarm": "off" as AnyObject])
  }
  
  @IBAction func refreshMenuPressed() {
    alarmStatus      = "Connecting ..."
    garageDoorStatus = "Connecting ..."
    lastUpdatedText  = "..."
    
    requestUpdate()
  }
  
  var garageDoorStatus: String? {
    didSet {
      if let status = garageDoorStatus   {
        garageDoorStatusLabel.setText(status)
        if(status == "Open") {
          garageDoorButton.setTitle("Close Garage")
        } else if(status == "Closed") {
          garageDoorButton.setTitle("Open Garage")
        } else {
          garageDoorButton.setTitle("Toggle Garage")
        }
      }
    }
  }
  
  var alarmStatus: String? {
    didSet {
      if let status = alarmStatus   {
        alarmStatusLabel.setText(status)
        
        if(status == "Ready") {
          alarmStatusLabel.setTextColor(UIColor.green)
        } else if(status.contains("Armed")) {
          alarmStatusLabel.setTextColor(UIColor.red)
        } else {
          alarmStatusLabel.setTextColor(UIColor.white)
        }
      }
    }
  }
  
  var lastUpdated: Date? {
    didSet {
      if let lastUpdated = lastUpdated   {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        formatter.dateStyle = .none
        lastUpdatedLabel.setText(formatter.string(from: lastUpdated))
      }
    }
  }
  
  var lastUpdatedText: String? {
    didSet {
      if let lastUpdatedText = lastUpdatedText   {
        lastUpdatedLabel.setText(lastUpdatedText)
      }
    }
  }
  
  override init() {
    super.init()
    
    session?.delegate = self
    session?.activate()
  }
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    let message = message as NSDictionary
    
    let garageDoor   = message.value(forKey: "garageDoor") as? String
    //let alarm        = message.valueForKey("alarm") as? String
    let alarmDisplay = message.value(forKey: "alarmDisplay") as? String
    
    if (garageDoor != nil)   { self.garageDoorStatus = String(garageDoor!).capitalized }
    if (alarmDisplay != nil) { self.alarmStatus      = alarmDisplay }
    
    lastUpdated = Date()
  }
  
  func requestUpdate() {
    sendMessage(["update": "request" as AnyObject])
  }
  
  func showErrorAlert(_ error: String){
    
    let h0 = { print("ok")}
    
    let action1 = WKAlertAction(title: "OK", style: .default, handler:h0)
    
    presentAlert(withTitle: "Error", message: error, preferredStyle: .actionSheet, actions: [action1])
  }
  
  func sendMessage(_ messageData: [String : AnyObject]) {
    print(session)
      if let session = session , session.isReachable {
        session.sendMessage(messageData,
          replyHandler: { replyData in
          }, errorHandler: { error in
            print(error)
        })
      }
  }
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
  }

  override func willActivate() {
    // This method is called when watch view controller is about to be visible to user
    super.willActivate()
    
    requestUpdate()
  }

  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }

}
