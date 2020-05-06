Feature: Store selector

Scenario: do login
    Given I am at the login page
    Then I enter valid credentials 
    Then I click on Submit button
    Then I am at the store selector page
    Then I check logo as 7B
    Then I check title  
    Then I check application name & page name
    Then I check search textbox is implemented & available on right hand corner
    Then I enter number in search box
    Then I click on previous button


Scenario: Check Order Landing Page
    Given I am at the login page
    Then I enter valid credentials 
    Then I click on Submit button
    Then I am at the store selector page
    Then I select a store
    Then I click on ordering button  
    Then Look for cycle type checkboxes
    # Then Validate Order By Vendor button is active
    # Then Validate Order By Vendor button is disabled when Non-daily is not selected
  
#Scenario: Header: Logo, Application Name and various functionalities. NOTE: The change in the NEW UX designs is 7BOSS Logo.
#Given after login
#When on the store selection page
#Then check Header,Logo, Application Name


# Scenario: Validate that the search capability is implemented and available on the right hand corner
# Given loggedin
# When storesearchcheckbox 
# Then it's on the rightside

# Scenario: Validate that the user is able to look up by Store Number
# Given clickonstoresearch
# When entered storeno
# Then searchresults per no.

# Scenario: Validate that the user is able to look up by Store Nick Name.
# Given clickonstoresearch
# When entered storeno
# Then searchresults per name

# Scenario: Validate that the search functionality is "alpha numeric".
# Given clickonstoresearch
# When enter alphanumeric
# Then no error

# Scenario: Validate that the user is provided with the search criteria as he/she keeps entering the number or character.x: If a user enters 12 then he should be displayed with the list of available options like: 1254, 1298 etc...
# Given enter search
# When 

# Scenario: Validate that the search criteria is displayed in ascending order.

# Scenario: Validate that Previous button is available on the footer of the page to navigate the user to the previous page.NOTE: In this case the user will be taken to the Sign-In page.