# VoiceOver Prerequisites

## Allow VoiceOver to be controlled

This setup is required to allow VoiceOver to be controlled by Guidepup.

1. Open the "VoiceOver Utility" application.

   ![MacOS Spotlight search for "VoiceOver Utility.app".](./voiceover_utility_spotlight.png)

2. On the "General" tab, tick the checkbox "Allow VoiceOver to be controlled with AppleScript".

   ![VoiceOver Utility General Tab highlighting the last form option: a ticked checkbox for "Allow VoiceOver to be controlled with AppleScript".](./voiceover_utility_checkbox.png)

## Allow app automation

This setup is required to allow applications, e.g. your terminal or IDE, to control other applications, i.e. VoiceOver.

1. Open the "Security & Privacy" application within "System Preferences". Choose the "Privacy" tab.

   ![System Preferences application with the Security & Privacy icon button highlighted.](./system_preferences_security_and_privacy_highlight.png)

2. Select the "Accessibility" option and click on the padlock to unlock configuration. This will require you to enter an admin username and password.

   ![Security & Privacy view of System Preferences with the Privacy tab open and the Accessibility option selected. The clickable padlock at the bottom of the application is highlighted.](./security_and_privacy_accessibility_padlock.png)

3. In the "Allow the apps below to control your computer." section, use the plus "+" button to add any application that you will run a Guidepup script from - this will likely be your preferred terminal or IDE. Ensure you have also ticked the checkbox next to each application that you will run a Guidepup script from.

   ![Security & Privacy view of System Preferences with the Privacy tab open and the Accessibility option selected. The "Allow the apps below to control your computer." section is highlighted, with two applications listed: Terminal.app and Visual Studio Code.app, both with their checkboxes ticked.](./security_and_privacy_accessibility_applications.png)
