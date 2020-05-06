@all
Feature: Verify Reporting Page

    Scenario: Verify Daily items Reporting Data
    When You are in BOSS home page 
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    And Check only Daily checkbox for selecting single day item
    And Disable the Order remaining items only radio button
    And Select All Daily Items
    And Click on Continue Button
    And Get the all items names and Order Quantity
    And You are in BOSS home page
    And Click on Reporting tab
    And Check only Daily checkbox for selecting single day item
    And Select All Daily Items in Reporting Page
    And Click on Continue Button
    And Wait for Spinner to close
    And Verify the default Date set to OrderWindow Date
    And Get reporting details by Item for Single day items

    Scenario: Verify Multiday items Reporting Data
    When You are in BOSS home page 
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    And Disable the Order remaining items only radio button
    And Check only Multi Day checkbox for selecting Multi day item
    And Select the first avilable multiday item and Verify remaing Items to Order
    And Click on Continue Button
    And Get the all items names and Order Quantity
    And You are in BOSS home page
    And Click on Reporting tab
    And Check only Multi Day checkbox for selecting Multi day item
    And Select All MultiDay Items in Reporting Page
    And Click on Continue Button
    And Wait for Spinner to close
    And Verify the default Date set to OrderWindow Date
    And Get reporting details by Item for Multiday items
    And Select the last week date from datepicker
