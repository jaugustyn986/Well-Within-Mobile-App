# iOS App Store Release Best Practices

This document defines engineering and product practices required to successfully submit an iOS application to Apple TestFlight and the App Store.

It is intended to guide automated development agents and engineers when preparing the application for release.

All recommendations are derived from Apple's official App Store Review Guidelines and iOS release best practices.

---

# 1. Release Readiness Principles

Before submitting to TestFlight or the App Store, the application must satisfy the following core principles.

1. The application must be **stable and crash-free during basic navigation**
2. The application must **not make misleading medical or health claims**
3. The application must **clearly communicate privacy and data handling**
4. Users must be able to **delete or reset their stored data**
5. The application must include **complete App Store metadata**
6. The app must include **valid versioning and build numbers**
7. The app must include **required icons and launch assets**

These are the most common reasons apps are rejected during review.

---

# 2. App Store Review Guidelines (Critical Areas)

Apple evaluates applications using several high-level guideline categories.

Key sections include:

• Safety  
• Performance  
• Business  
• Design  
• Legal / Privacy  

All apps must also include a **publicly accessible privacy policy and disclose how user data is handled**.

Health and personal data are treated as **sensitive data and must not be used for advertising or marketing purposes**.

---

# 3. Privacy and Data Handling

Applications must clearly disclose:

• what data is collected  
• how it is used  
• whether it is shared with third parties  
• how users can delete their data  

Apple requires:

• A privacy policy URL in App Store metadata  
• An accessible privacy explanation inside the app  
• Accurate privacy labels describing collected data  

Best practice implementation:

Settings screen should contain:

Privacy
Data Storage
Clear All Data
Support

Example:

Settings → Privacy

"This app stores cycle observations locally on your device.  
Well Within does not sell or share personal health data."

---

# 4. Sensitive Health Data Practices

If the application collects health-related information:

The app must:

• treat the data as sensitive
• avoid sharing with advertising networks
• avoid third-party profiling
• clearly disclose what data is stored

Health data should ideally be:

• processed on-device
• stored locally
• encrypted where possible

Apple emphasizes **minimizing data collection and prioritizing on-device processing**.

---

# 5. Required User Controls

The application must allow users to control their data.

Minimum expectations:

Users must be able to:

• delete stored data
• revoke permissions
• understand how data is stored

Example implementation:

Settings → Clear All Data

Behavior:

• deletes all observations
• resets application state
• does not require an account system

If accounts exist:

Apple requires **account deletion functionality inside the app**.

---

# 6. Permissions Best Practices

Apps must request system permissions only when necessary.

Examples:

Notifications  
Camera  
Photos  
Location  
HealthKit  

Each permission must include a **clear explanation string** describing why it is required.

Example:

"Notifications are used to remind you to record daily observations."

Avoid including permission keys in the project unless they are actively used.

Unused permissions are a common cause of review rejection.

---

# 7. App Stability Expectations

Reviewers test the app by:

1. Installing the app
2. Completing onboarding
3. Navigating primary screens
4. Creating sample data
5. Opening settings

Any crash during this flow can result in rejection.

Engineering requirements:

• guard against null data
• ensure local storage initialization
• ensure navigation paths always exist
• prevent empty state crashes

---

# 8. Versioning and Build Numbers

Every TestFlight submission must include:

• Version number
• Build number

Example:

Version: 1.0  
Build: 1

Each new upload must increment the **build number**.

---

# 9. Required App Assets

App Store submissions require specific assets.

Minimum assets:

App Icon
1024x1024 marketing icon

Launch / splash screen

Screenshots

Recommended screenshot set:

6.7" iPhone (primary)
6.5" iPhone
5.5" fallback

Screenshots should demonstrate:

• primary user flow
• key features
• onboarding or core UI

---

# 10. App Store Metadata Requirements

Required metadata fields include:

App name  
Subtitle  
Description  
Keywords  
Support URL  
Privacy Policy URL  

Required App Store Connect setup also includes:

Privacy details (data collection labels)  
Export compliance / encryption answers  
Age rating and content rights confirmations  

Optional but recommended:

Marketing website  
Help / FAQ page

---

# 11. Avoiding Misleading Claims

Apps in health and fertility categories must avoid claims such as:

"Guarantees pregnancy"
"Diagnoses medical conditions"
"Provides medical treatment"
"Predicts ovulation"

Allowed phrasing:

"Track observations"
"Understand patterns in your cycle"
"Learn about your body"

The application should present itself as a **tracking and educational tool**, not a medical device.

Do not claim prediction capability in product UI or metadata.

---

# 12. TestFlight Preparation Checklist

Before uploading a TestFlight build verify:

Build succeeds in release mode  
Version and build numbers updated  
Icons present  
Splash screen configured  
No unused permissions in Info.plist  
Privacy policy URL added  
Settings include privacy explanation  
Settings include data deletion option  

---

# 13. TestFlight Distribution

Two tester types exist.

Internal Testers

• up to 100 people
• no Apple review required
• builds available immediately

External Testers

• up to 10,000 testers
• first build requires TestFlight review

---

# 14. Post-Submission Iteration

Once the app is in TestFlight:

Each change requires:

• new build
• upload
• processing

Typical update cycle:

Commit code  
Build iOS binary  
Submit build  
Testers update via TestFlight

---

# 15. Design and UX Expectations

Apple evaluates overall app quality.

Apps should provide:

• clear navigation
• responsive UI
• readable typography
• consistent styling

Avoid:

• placeholder screens
• empty UI states
• unfinished sections

---

# 16. Common Rejection Reasons

Most frequent rejection causes:

Missing privacy policy  
Unused permissions  
App crashes  
Misleading health claims  
Broken onboarding flow  
Login required without reason  

Engineering agents should verify these conditions before submission.

---

# 17. Release Philosophy

Successful App Store releases prioritize:

stability  
privacy transparency  
clear purpose  
minimal friction

Focus on delivering a **complete but simple MVP experience**.

Complex features can be added after initial TestFlight validation.
