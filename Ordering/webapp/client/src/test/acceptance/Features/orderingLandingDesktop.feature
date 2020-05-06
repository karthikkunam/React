
Feature: Order Landing Page

Scenario: Validate cycle-type counts
    Given I am at the order landing page
    Then Validate cycle-type counts for Carried & All items  

Scenario: Check color coded bars for cycle-types
    Given I am at the order landing page
    Then I should see the color coded bars
    Then All cycle types are selected by default

Scenario: Validate Guided Replenishment recap
    Given I am at the order landing page
    When I click on Guided Replenishment recap
    Then It sends me to Guided Replenishment recap page

Scenario: Validate Order by Vendor button is activated only when non-daily is selected
    Given I am at the order landing page
    When I click on order by vendor button
    Then Order by vendor button is activated
    When I uncheck Non-daily
    Then Order by vendor button is deactivated

Scenario: Validate Order remaining items toggle
    Given I am at the order landing page
    Then Order remaining items toggle is OFF
    When I click on the toggle
    Then Order remaining items toggle is ON

Scenario: Validate color coded bars for Groups
    Given I am at the order landing page
    Then Categories should have a color coded bar on the left side

Scenario: Validate that by default all groups are collapsed
    Given I am at the order landing page
    Then All Groups should be collapsed by default
    When I click on the arrow button on the right
    Then Categories will display under Groups    

Scenario: Validate that store number has 5 digits
    Given I am at the order landing page
    Then Store number should have 5 digits

Scenario: Validate that non-daily cycle type includes GR categories 
    Given I am at the order landing page
    When Deselect Daily and Multi day cycle types
    Then The remaining categories are non-daily and GR

Scenario: Validate GR groups names
    Given I am at the order landing page
    Then GR groups should have "-GR" suffix to the group name

Scenario: Validate counts are displayd to reflect both non-daily and GR
    Given I am at the order landing page
    When Deselect Daily and Multi day cycle types
    Then Counts should match the total of GR and non-daily groups      

Scenario: Validate the order of categories inside a group
    Given I am at the order landing page
    Then The list of categories is desplayed in alphabetical order

Scenario: Validate status indicator and text description
    Given I am at the order landing page
    Then Status indicator and status text should be present and match
@run
Scenario: Validate continue button
    Given I am at the order landing page
    Then Continue button should be deactivated
    When I select a group
    Then Continue button will become available

Scenario: Validate Groups/Category feature is implemented
    Given I am at the order landing page
    When I select a group
    Then All categories should be selected automatically
    When I select all categories for a particular group
    Then The group should be selected automatically
    When I select two groups
    Then Should be two groups and all their categories selected  

# @ManualTest
# Scenario: Cosmetics (font size, font style, margins, colors)
    #  Check styling (font-size, font-style and color) for cycle types Daily, Multi Day and Non-Daily
    #  Check styling (font-size, font-style and color) for labels "x/x left to order"
    #  Check margins for cycle types (Daily, Multi Day and Non-Daily)
    #  Check the styling for buttons (ORDER BY VENDOR, CONTINUE, Guided Replenishment Recap)
    #  Check styling (font-size, font-style and color) for title text (ORDERING) and store number text on the top of the page
    #  Check styling (font-size, font-style and color) for Order remaining items only toggle and Select Items to order radio button
    #  Check styling (font-size, font-style and color) for Groups and Categories
    #  Check styling for status text (Pending or Complete)
    #  Check the alignment for all the above elements
