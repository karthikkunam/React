@all
Feature: Ordering a Multi day item

Scenario: Verify Ordering a multi day item with Order Remaining Items True
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Click on All Radio button
And Check only Multi Day checkbox for selecting Multi day item
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Verify Cursor if defaulted to first question
And Get the required Item details from the Service for 'MultiDaily'
And Verify Tooltip for the Item
And Verify the default values for all questions for first item
And Answer all the questions
And Verify the Formula
And Answer the questions with special characters
And Answer the questions with Zero
And Verify the Daily Trend for last '4' days
And Verify the Weekly Trend for last '4' weeks for Multiday Item
And Verify the Next day Weekly Trend for last '4' weeks for Multiday Item
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Click on Submit Button

Scenario: Verify Ordering a multi day item with Order Remaining Items False with Carried Items
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Disable the Order remaining items only radio button
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Verify Cursor if defaulted to Order textBox
And Answer all the questions
And Verify the Formula
And Update Order quantity for second item
And Verify the Daily Trend for last '4' days
And Verify the Weekly Trend for last '4' weeks for Multiday Item
And Verify the Next day Weekly Trend for last '4' weeks for Multiday Item
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Click on Submit Button

Scenario: Verify Ordering a single day item with Order Remaining Items True and with All Items Radio button ON
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Disable the Order remaining items only radio button
And Click on All Radio button
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Verify the Daily Trend for last '4' days
And Verify the Weekly Trend for last '4' weeks for Multiday Item
And Verify the Next day Weekly Trend for last '4' weeks for Multiday Item
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Click on Submit Button

Scenario: Verify Warning message when you click on Home button in the middle of transaction
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Click in Home Button and verify the popup for Multiday Item
And Click Place Order from Landing Page to navigate to Order Selection page.
And Disable the Order remaining items only radio button
And Check only Multi Day checkbox for selecting Multi day item
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key for multiday
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Enter Order quantity for first item in review and finalize page for 'MultiDay'
And Click On Home Button and verify that we are in ordering page


Scenario: Verify Ordering a multi day item with clicking Previous Button in the middle of order
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Disable the Order remaining items only radio button
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key for multiday
And Click On Previous Button and Verify pop up message
And Click Place Order from Landing Page to navigate to Order Selection page.
And Disable the Order remaining items only radio button
And Check only Multi Day checkbox for selecting Multi day item
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key for multiday
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Enter Order quantity for first item in review and finalize page for 'MultiDay'
And Click On Previous Button and Verify pop up message

Scenario: Verify Ordering a Multi day item with Order Remaining Items False and order all items with 10 Quantity
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Disable the Order remaining items only radio button
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Enter Order Quantity as '10' all the items
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Verify the Items Ordered count matches
And Click on Submit Button 
And Verify that Order reaminging Quantity as '0'


Scenario: Verify Ordering a MultiDay day item with Order Remaining Items False and order all items with 5 Quantity
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Multi Day checkbox for selecting Multi day item
And Disable the Order remaining items only radio button
And Select the first avilable multiday item and Verify remaing Items to Order
And Click on Continue Button
And Enter Order Quantity as '5' all the items
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Verify the Items Ordered count matches
And Click on Submit Button 
And Verify that Order reaminging Quantity as '0'
