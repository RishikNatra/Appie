---

Rishik Natra - 23bcs108

Rithwik Mahanti - 23bcs109

Sree Samhita - 23bec056

---

## Product Name and Category

- **Name:** Appie
- **Category:** Digital Healthcare Product
- **Product Type:** Digital Product

---

## Product Hierarchy

### Product

**Product:** The entire Appie web app, a digital healthcare application that helps users manage routine health concerns through symptom assessment, medication access, and professional consultation.

Getting a routine, low-risk health concern assessed and managed without requiring an unnecessary in-person doctor visit.

- **Users?** Young urban professionals and families in India
- **Problem are we solving?** Time, cost, and inconvenience associated with in-person visits for minor health concerns
- **Platforms?** Web application initially, mobile application as a future extension
- **Business goals?** Provide accessible basic health assessment through a freemium model, with paid consultation and medication delivery services
- **Competitors?** Practo, Tata 1mg, Apollo 24|7
- **Success metrics?** Time to reviewed recommendation, assessment-to-action completion rate, and user-reported confidence

### System

Major functional systems:

- **Account System** = Manages registration, login, user profile, health profile, and consent.
- **Health Assessment System** = Allows users to enter symptoms and receive an initial assessment of their routine health concern
- **Consultation System** = Enables users to find, select, schedule, and communicate with verified medical professionals.
- **Medication System** = Allows users to view, verify, select, and order appropriate medicines through the platform.
- **Review System** = Manages professional verification and review of health assessments, medication recommendations, and prescriptions where required.
- **Prescription System** = Manages the creation, storage, and delivery of e-prescriptions issued by authorized medical professionals.
- **Payment & Transaction System** = Handles payments for consultations, medicines, delivery, and other applicable services.
- **Order System** = Manages pharmacy order processing, order status, and medicine delivery tracking.
- **Notification & Tracking System** = Keeps users informed about assessments, consultations, orders, payments, and delivery status.
- **Records System** = Stores health history, previous assessments, prescriptions, consultations, and follow-up information.

### Modules, Screens and their Components

- Account System
    - Registration Module
        - Patient Registration Screen
            - Account Type Selector
            - Personal Information Form
            - Contact Information Form
            - Account Credentials Form
            - Terms & Consent Component
            - Registration Action Component
        - Health Professional Registration Screen
            - Professional Account Information Form
            - Personal Information Form
            - Contact Information Form
            - Professional Details Form
            - Account Credentials Form
            - Terms & Consent Component
            - Registration Action Component
        - Registration Verification Screen
            - Verification Code Component
            - Verification Status Component
            - Code Resend Component
            - Verification Action Component
        - Medical Status Verification Screen
            - Professional Credential Upload Component
            - Professional Information Component
            - Verification Status Component
            - Verification Submission Component
    - Authentication Module
        - Patient Login Screen
            - Login Credentials Form
            - Remember Me Component
            - Login Action Component
            - Password Recovery Link Component
            - Account Registration Prompt Component
        - Health Professional Login Screen
            - Login Credentials Form
            - Professional Verification Status Component
            - Login Action Component
            - Password Recovery Link Component
            - Account Registration Prompt Component
        - 2FA Screen
            - Verification Code Component
            - Authentication Method Component
            - Code Resend Component
            - Verification Action Component
            - Recovery Option Component
        - Password Recovery Screen
            - Account Identification Form
            - Recovery Method Component
            - Verification Code Component
            - New Password Form
            - Password Reset Status Component
    - User Profile Module
        - Profile Overview Screen
            - Profile Header Component
            - Personal Information Component
            - Contact Information Component
            - Profile Completion Component
            - Profile Action Component
        - Edit Profile Screen
            - Personal Information Form
            - Contact Information Form
            - Profile Photo Component
            - Profile Save Component
    - Health Profile Module
        - Health Profile Overview Screen
            - Health Profile Summary Component
            - Basic Health Information Component
            - Medical Conditions Component
            - Allergy Information Component
            - Health Profile Action Component
        - Health Information Screen
            - Medical Information Form
            - Medication Information Component
            - Allergy Information Component
            - Medical History Component
            - Health Information Save Component
    - Consent Management Module
        - Consent Information Screen
            - Consent Explanation Component
            - Consent Category Component
            - Consent Requirement Component
            - Consent Action Component
    - Settings Module
        - Settings Overview Screen
            - Account Settings Component
            - Notification Preferences Component
            - Privacy & Security Component
            - Application Preferences Component
            - Settings Navigation Component
- Health Assessment System
    - Symptom Input Module
        - Symptom Entry Screen
            - Symptom Search Component
            - Symptom Selection Component
            - Symptom Entry Form
            - Symptom List Component
            - Symptom Submission Component
    - Symptom Tracking Module
        - Symptom Overview Screen
            - Active Symptoms Component
            - Symptom Summary Component
            - Symptom Status Component
            - Symptom Tracking Action Component
        - Symptom Progress Screen
            - Symptom Progress Chart Component
            - Symptom Timeline Component
            - Symptom Status Component
            - Symptom Update Component
    - Assessment Module
        - Assessment Result Screen
            - Assessment Summary Component
            - Possible Condition Component
            - Confidence/Assessment Indicator Component
            - Recommendation Component
            - Next-Step Action Component
            - Professional Consultation Prompt Component
- Consultation System
    - Healthcare Professional Module
        - Professional Search & Discovery Screen
            - Professional Search Component
            - Professional Filter Component
            - Professional Result List Component
            - Professional Summary Card Component
        - Professional Profile Screen
            - Professional Profile Header
            - Professional Credentials Component
            - Professional Experience Component
            - Professional Rating & Review Component
            - Consultation Fee Component
            - Availability Component
            - Professional Selection Component
    - Appointment Module
        - Appointment Scheduling Screen
            - Professional Availability Component
            - Date Selector Component
            - Time Slot Component
            - Appointment Type Component
            - Scheduling Action Component
        - Appointment Details Screen
            - Appointment Summary Component
            - Professional Summary Component
            - Date & Time Component
            - Consultation Information Component
            - Appointment Confirmation Component
        - Appointment Management Screen
            - Appointment Status Component
            - Appointment Details Component
            - Reschedule Component
            - Cancellation Component
            - Appointment Action Component
    - Consultation Module
        - Consultation Preparation Screen
            - Appointment Summary Component
            - Patient Information Component
            - Consultation Preparation Component
            - Document/Record Access Component
            - Consultation Start Component
        - Consultation Summary Screen
            - Consultation Summary Component
            - Professional Notes Component
            - Recommendations Component
            - Follow-up Information Component
            - Prescription Reference Component
            - Consultation Completion Component
- Medication System
    - Medication Information Module
        - Medication Search & Browse Screen
            - Medication Search Component
            - Medication Category Filter
            - Medication Result List Component
            - Medication Summary Card Component
        - Medication Information Screen
            - Medication Overview Component
            - Usage Information Component
            - Safety & Warning Component
            - Dosage Information Component
            - Availability Component
            - Medication Selection Component
    - Medication Selection Module
        - Medication Cart Screen
            - Selected Medication List Component
            - Medication Quantity Component
            - Medication Requirement Component
            - Cart Summary Component
            - Cart Action Component
    - Verification Module
        - Medication Verification Screen
            - Medication Verification Summary
            - Prescription Requirement Component
            - Medication Eligibility Component
            - Verification Status Component
            - Verification Action Component
- Review System
    - Health Assessment Review Module
        - Assessment Review Screen
            - Patient Assessment Summary Component
            - Symptom Information Component
            - Assessment Result Component
            - Supporting Health Information Component
            - Review Action Component
        - Assessment Review Outcome Screen
            - Review Outcome Component
            - Professional Remarks Component
            - Recommendation Component
            - Review Status Component
            - Review Completion Component
    - Prescription Review Module
        - Prescription Review Screen
            - Prescription Summary Component
            - Patient Information Component
            - Medication Details Component
            - Prescription Validation Component
            - Review Action Component
        - Prescription Review Outcome Screen
            - Review Outcome Component
            - Professional Remarks Component
            - Prescription Status Component
            - Review Completion Component
- Prescription System
    - Prescription Module
        - Prescription Creation Screen
            - Patient Information Component
            - Medication Entry Component
            - Dosage & Instruction Component
            - Prescription Duration Component
            - Prescription Notes Component
            - Prescription Creation Action
        - Prescription Management Screen
            - Prescription Summary Component
            - Prescription Status Component
            - Prescription Modification Component
            - Prescription History Component
            - Prescription Action Component
        - Prescription Access & Sharing Screen
            - Prescription Viewer Component
            - Prescription Download Component
            - Prescription Sharing Component
            - Prescription Access Control Component
- Payment & Transaction System
    - Payment Processing Module
        - Payment Summary Screen
            - Order/Service Summary Component
            - Price Breakdown Component
            - Discount/Adjustment Component
            - Final Amount Component
            - Payment Action Component
        - Payment Method Screen
            - Saved Payment Methods Component
            - Payment Method Selection Component
            - Add Payment Method Component
            - Payment Confirmation Component
        - Payment Status Screen
            - Payment Status Component
            - Transaction Summary Component
            - Payment Reference Component
            - Payment Action Component
    - Transaction Management Module
        - Transaction History Screen
            - Transaction Filter Component
            - Transaction List Component
            - Transaction Summary Card Component
        - Transaction Details Screen
            - Transaction Summary Component
            - Payment Details Component
            - Transaction Status Component
            - Receipt Component
- Order System
    - Order Processing Module
        - Order Summary Screen
            - Order Item List Component
            - Delivery Address Component
            - Price Breakdown Component
            - Order Summary Component
            - Order Placement Action Component
        - Order Processing Status Screen
            - Order Status Component
            - Order Progress Tracker Component
            - Order Summary Component
            - Processing Information Component
    - Order Management Module
        - Order History Screen
            - Order Filter Component
            - Order List Component
            - Order Summary Card Component
        - Order Details Screen
            - Order Information Component
            - Ordered Items Component
            - Payment Summary Component
            - Order Status Component
            - Order Action Component
    - Delivery Tracking Module
        - Delivery Tracking Screen
            - Delivery Progress Tracker Component
            - Current Delivery Status Component
            - Delivery Address Component
            - Estimated Delivery Component
            - Delivery Contact Component
        - Delivery Details Screen
            - Delivery Information Component
            - Delivery Address Component
            - Delivery Timeline Component
            - Delivery Status Component
            - Delivery Support Component
- Notification & Tracking System
    - Notification Module
        - Notification Center Screen
            - Notification Category Component
            - Notification List Component
            - Notification Summary Card Component
            - Notification Filter Component
            - Notification Management Component
    - Status Tracking Module
        - Status Overview Screen
            - Status Summary Component
            - Status Category Component
            - Active Status List Component
            - Status Navigation Component
        - Status Details Screen
            - Status Header Component
            - Status Progress Component
            - Status Timeline Component
            - Status Information Component
            - Related Action Component
- Records System
    - Health Records Module
        - Health Records Overview Screen
            - Health Record Category Component
            - Health Record List Component
            - Health Record Summary Card Component
            - Record Filter Component
        - Health Record Details Screen
            - Health Record Header Component
            - Health Information Component
            - Record Details Component
            - Record Timeline Component
            - Record Access Component
    - Assessment & Prescription Records Module
        - Assessment & Prescription Records Screen
            - Record Category Component
            - Assessment Record List Component
            - Prescription Record List Component
            - Record Filter Component
            - Record Summary Card Component
        - Assessment Record Details Screen
            - Assessment Record Header Component
            - Symptom Summary Component
            - Assessment Result Component
            - Assessment Outcome Component
            - Assessment Timeline Component
        - Prescription Record Details Screen
            - Prescription Record Header Component
            - Prescription Information Component
            - Medication Details Component
            - Prescription Status Component
            - Prescription Timeline Component
            - Prescription Access Component
    - Consultation & Follow-up Records Module
        - Consultation & Follow-up Records Screen
            - Consultation Record List Component
            - Follow-up Record List Component
            - Record Filter Component
            - Record Summary Card Component
        - Consultation Record Details Screen
            - Consultation Record Header Component
            - Consultation Summary Component
            - Professional Information Component
            - Consultation Outcome Component
            - Consultation Timeline Component
        - Follow-up Record Details Screen
            - Follow-up Header Component
            - Follow-up Information Component
            - Follow-up Instructions Component
            - Follow-up Status Component
            - Follow-up Timeline Component

### UI Elements

- Text
- Text Field
- Password Field
- Button
- Icon
- Image
- Checkbox
- Radio Button
- Toggle / Switch
- Dropdown / Select
- Search Bar
- Date Picker
- Time Picker
- Selection Indicator
- Link
- Badge
- Divider
- Progress Indicator
- Avatar
- Tooltip / Information Indicator

### Design Detail and Micro-detailing

- Font = Inter Bold
- Animation = 250 ms
- Touch target = 48 px minimum
- Light Mode:
    - Text Colour = #000000
    - Background Colour = #EFEEEE
    - Primary Colour = #1D348A
    - Secondary Colour = #162768
    - Accent Colour = #FFB200
- Dark Mode:
    - Text Colour = #EFEEEE
    - Background Colour = #000000
    - Primary Colour = #1D348A
    - Secondary Colour = #162768
    - Accent Colour = #FFB200

---

## Product Ecosystem

- **Product Type**
    
    Appie is primarily a digital healthcare product because its primary value and functionality are delivered through a software-based web application, enabling users to access health assessment, professional consultation, medication services, and health records digitally, but a major value is obtained after delivery of required medicines in the physical world, making it phygital.
    
- **Ecosystem**
    
    Used in a Healthcare environment.
    
    - **Direct Users:**
        - Patient
        - Healthcare Professional
        - Pharmacy / Medicine Supplier
        - Delivery Partner
    - **Indirect Users:**
        - Payment Service
        - Identity & Verification
        - Notification Service

---

## Intended Users

- **Primary Users**
    - **Young urban professionals**
        - Need convenient access to healthcare around work and daily schedules.
        - Prefer quick digital access for routine health concerns.
    - **Families**
        - Need convenient access to healthcare for routine health concerns of family members.
        - Benefit from centralized access to health information and services.
- **Secondary Users**
    - **Healthcare Professionals**
        - Registered medical professionals who assess, consult, review cases, and provide prescriptions or follow-up care.
- **Service & Operational Users**
    - **Partner Pharmacies**
        - Receive and fulfil medicine orders placed through Appie.
        - Provide medicine availability and order fulfilment.
    - **Delivery Personnel**
        - Collect and deliver medicines to customers.
        - Update delivery status and completion.

---

## User Context

!1.png

!Appie.png

!Appie (1).png.png)

!Appie (2).png.png)

!Appie (3).png.png)

!Appie (4).png.png)

!Appie (5).png.png)

!Appie (6).png.png)

---

## Stakeholders

- **Primary Stakeholders**
    - **Patients**
        - Patients use Appie for symptom assessment, consultation, medication access, and health records.
        - Interests = Convenience, affordability, privacy, reliable healthcare access.
    - **Healthcare Professionals**
        - Healthcare Professionals review patient information, conduct consultations, provide professional recommendations, and manage prescriptions/follow-ups.
        - Interests = Revenue source, Profile building, efficient workflow, professional control.
- **Secondary Stakeholders**
    - **Partner Pharmacies**
        - Verify, prepare, and fulfil medication orders.
        - Interests = Increased business, accurate orders, prescription verification, efficient fulfilment.
    - **Delivery Personnel**
        - Collect and deliver fulfilled medicine orders.
        - Interests = Revenue source, Accurate delivery information, efficient delivery process.
    - **Appie Management Team**
        - Defines services, manages partnerships, pricing, and overall platform operations.
        - Interests = Successful business, revenue growth, Sustainable operations, user adoption, service quality.
- **Tertiary Stakeholders**
    - **Payment Service Providers**
        - Process consultation and medication-related payments.
        - Interests: Business model, Secure and reliable transactions.
    - **Identity / Verification Services**
        - Support account and healthcare-professional verification.
        - Interests = Business model, Accurate identity and professional-status verification.
- **External Stakeholders**
    - **Healthcare Regulatory Authorities**
        - Establish or oversee applicable healthcare, professional, privacy, and medication-related requirements.
        - Interests = Compliance, patient safety, and responsible healthcare delivery.

---

## Existing Competitors

### Practo

- Primary focus = Doctor discovery and consultation.
- Model = Connects patients to professionals.
- Diagnostics = Healthcare/diagnostic services are provided by professionals in consultations.
- Consultation = Online consultations with specialized professionals is provided.
- Medicine = Limited delivery available.
- Key relevance to Appie = Professional discovery is highly relevant.

### Tata 1mg

- Primary focus = Medicines and health information.
- Model = Healthcare commerce platform.
- Diagnostics = Conducts lab tests with home sample collection.
- Consultation = Online doctor consultation with specific doctors.
- Medicine = Structured medicine ordering system.
- Key relevance to Appie = Medication access is highly relevant.

### Apollo 24/7

- Primary focus = Digital Healthcare.
- Model = Digital healthcare ecosystem.
- Diagnostics = At-home diagnostic tests.
- Consultation = Online doctor consultation with specific doctors.
- Medicine = Online pharmacy available.
- Key relevance to Appie = Consultations, diagnostics and medication are highly relevant.

---

## Product Anatomy

- **Identity** = Appie is a digital healthcare application designed to help users manage routine health concerns.
- **Architecture** = Appie uses a web-based architecture connecting users with healthcare, medication, payment, and delivery services.
- **Systems** = Account, Health Assessment, Consultation, Medication, Verification, Order systems.
- **Sub-Systems** = Registration, Profile, Symptom Dashboard, Consultation Dashboard, Prescriptions, Medicine Store, Cart
- **Components** = Forms, search controls, information cards, status indicators, progress trackers, and action controls.
- **Features** = Symptom assessment, symptom tracking, professional consultation, medication access, prescription management, delivery tracking, and health records.
- **Interfaces** = Navigation, Registration screens, APIs
- **Materials** = React and Next.js frameworks, Firebase Authentication, Supabase Database, and external APIs used to build and connect Appie.
- **Surface Elements** = Color palette, typography, icons, illustrations, and consistent healthcare-focused UI theme.
- **Manufacturing Details** = Software development, code compilation, testing, CI/CD pipeline, deployment, and application packaging.
- **Interaction Points** = Buttons, forms, search fields, touch controls, navigation controls, and user input elements.
- **Fastening Mechanisms** = Navigation links, API calls, data binding, and component hierarchy that connect the application’s functional elements.
- **Protective Elements** = Authentication, authorization, encryption, permissions, session timeout, and data backup.
- **Service Elements** = App updates, bug reporting, cache management, customer support, and cloud synchronization.

---

## Product Architecture

- Appie follows a web-based client–server architecture.
- The frontend is built using React and Next.js, providing the user interface and application logic. Firebase Authentication manages user authentication, while Supabase provides database services for storing and managing application data.
- External APIs connect Appie with supporting services such as payments, notifications, verification, and other healthcare-related functions.

---

## Problem Identified

- **Unnecessary Physical Visits** = Routine or minor health concerns may require patients to travel to clinics even when an initial assessment could potentially be handled digitally.
- **Time and Travel Difficulty** = Visiting a healthcare facility involves commuting, waiting, and taking time away from work, education, or other responsibilities.
- **Difficulty Finding Suitable Professionals** = Patients may have limited information when selecting a healthcare professional based on factors such as specialization, experience, availability, and consultation cost.
- **Limited Information** = Relevant health information, previous assessments, prescriptions, consultations, and follow-ups may not be organized in one accessible digital record.
- **Medication Access** = After receiving medical advice or a prescription, patients may still need to separately locate, verify, purchase, and arrange delivery of medicines.
- **Uncertainty During Follow-Up** = Patients may lack a convenient way to track symptoms, review previous healthcare interactions, and manage follow-up actions.

---

## Key User Needs

- **Functional needs**
    - Quick symptom assessment
    - Easy professional consultation
    - Convenient medication access
- **Accessibility needs**
    - Access healthcare from home
    - Availability across common devices
    - Easy access to health information
    - Support for users with limited time
- **Economic needs**
    - Affordable healthcare access
    - Transparent consultation and medicine costs
    - Reduced travel and waiting costs
    - Avoidance of unnecessary healthcare expenses
- **Usability needs**
    - Simple and intuitive navigation
    - Easy symptom and health-data entry
    - Clear and understandable information
    - Quick and hassle-free processes
- **Experiential needs**
    - Confidence in healthcare decisions
    - Reassuring and trustworthy experience
    - Reduced uncertainty during care
    - Consistent experience across healthcare stages
- **Maintenance needs**
    - Secure health information
    - Accessible health records
    - Reliable prescription and consultation history
    - Consistent system availability

---

## User Requirements

- **Healthcare access**
    - Appie should allow users to access routine healthcare services remotely through a web-based platform.
    - Appie should minimize unnecessary travel and waiting for routine health concerns.
- **Symptom assessment**
    - Appie should provide a structured interface for users to enter their symptoms and relevant health information.
    - Appie should provide an initial assessment and clearly communicate the appropriate next step.
- **Professional consultation**
    - Appie should allow users to search and select healthcare professionals using relevant information such as specialization, experience, availability, and consultation cost.
    - Appie should support appointment scheduling and online consultation.
- **Medication access**
    - Appie should provide relevant medication information in an understandable format.
    - Appie should allow users to select, verify, order, and track medicines through the platform.
- **Prescription management**
    - Appie should allow authorized users to securely create, access, manage, and share prescriptions.
    - Appie should maintain prescription information for future reference.
- **Health records**
    - Appie should organize assessments, prescriptions, consultations, and follow-up information in accessible digital records.
    - Appie should allow users to review relevant previous health information when needed.
- **Tracking and follow-up**
    - Appie should allow users to track symptom progress, appointments, prescriptions, orders, and deliveries.
    - Appie should provide notifications for important status changes and follow-up actions.
- **Usability**
    - Appie should provide simple navigation and clear workflows for common healthcare tasks.
    - Appie should present health-related information in a clear and understandable manner.
- **Security and privacy**
    - Appie should authenticate users and restrict health information to authorized access.
    - Appie should protect personal and health data through appropriate security mechanisms.
- **Reliability**
    - Appie should provide consistent access to essential healthcare functions and maintain accurate user records.

---

## Functional Requirements

- **Account Management**
    - Support patient and healthcare-professional registration.
    - Authenticate users through secure login and 2FA.
    - Support password recovery, profile management, and professional-status verification.
    - Apply appropriate access permissions based on user role.
- **Health Assessment**
    - Allow users to enter and update symptoms.
    - Track symptom progress over time.
    - Generate and display an initial assessment.
    - Provide appropriate next-step guidance based on the assessment.
- **Professional Consultation**
    - Allow users to search and filter healthcare professionals.
    - Display professional profiles, availability, experience, and consultation cost.
    - Allow users to schedule, manage, and attend appointments.
    - Provide consultation preparation and consultation-summary functions.
- **Medication Management**
    - Allow users to search and browse medications.
    - Display relevant medication information.
    - Support medication selection and cart management.
    - Perform required medication verification before fulfilment.
- **Review and Prescription**
    - Allow authorized healthcare professionals to review assessments.
    - Support prescription creation, review, management, access, and sharing.
    - Maintain prescription records for future reference.
- **Payment and Transactions**
    - Display payment summaries and available payment methods.
    - Process healthcare-related payments securely.
    - Provide payment status and transaction history.
    - Allow users to view individual transaction details.
- **Order and Delivery**
    - Create and process medication orders.
    - Provide order history and order details.
    - Display order-processing and delivery status.
    - Allow users to track deliveries.
- **Notifications and Status**
    - Notify users about relevant appointments, assessments, prescriptions, orders, and other status changes.
    - Provide centralized status information and detailed status updates.
- **Health Records**
    - Store and organize health records, assessments, prescriptions, consultations, and follow-ups.
    - Allow users to access relevant historical records and individual record details.
    - Maintain continuity between previous and ongoing healthcare activities.

---

## Product Comparison

| Feature | Appie | Practo | Tata 1mg | Apollo 24/7 |
| --- | --- | --- | --- | --- |
| **Primary Focus** | Digital healthcare for routine health concerns | Doctor discovery & consultation | Medicines & health information | Digital healthcare |
| **Business Model** | Integrated healthcare platform | Professional marketplace | Healthcare commerce platform | Digital healthcare ecosystem |
| **Symptom Assessment** | Initial symptom assessment & tracking | Not a primary focus | Not a primary focus | Not a primary focus |
| **Diagnostics** | Initial digital assessment | Healthcare/diagnostic services | Lab tests with home collection | At-home diagnostic tests |
| **Consultation** | Online professional consultation | Online professional consultation | Online doctor consultation | Online doctor consultation |
| **Medicine** | Selection, verification, ordering & delivery | Limited delivery | Structured medicine ordering | Online pharmacy |
| **Prescription** | Creation, review, access & management | Consultation-related | Consultation-related | Consultation-related |
| **Health Records** | Assessments, prescriptions & consultations | Not a primary focus | Health information/records | Digital health records |
| **Tracking** | Symptoms, appointments, orders & delivery | Appointment-related | Orders & diagnostics | Orders & healthcare services |

---

## Prioritized Product Requirements

### Essential Requirements

- **Symptom assessment** = Users must be able to enter symptoms and receive an initial assessment with clear next-step guidance.
- **Professional consultation** = Users must be able to discover suitable healthcare professionals, view relevant information, schedule appointments, and access consultations.
- **Medication access** = Users must be able to view medication information, complete required verification, place orders, and track delivery.
- **Prescription management** = The system must support prescription creation, review, secure access, management, and sharing.
- **Health records** = The system must maintain accessible records of assessments, prescriptions, consultations, and follow-ups.
- **Account and security** = The system must provide secure registration, authentication, role-based access, and protection of health information.

### Important Requirements

- **Symptom tracking** = Users should be able to monitor changes in their symptoms over time.
- **Appointment management** = Users should be able to view, modify, and manage upcoming and completed appointments.
- **Payment and transactions** = The system should support secure payments, transaction records, and payment-status tracking.
- **Order and delivery tracking** = Users should be able to monitor medication order and delivery status.
- **Notifications** = The system should provide timely updates for assessments, appointments, prescriptions, orders, and other relevant activities.

### Supporting Requirements

- **Record sharing** = Users should be able to securely share relevant health records and prescriptions when required.
- **Follow-up management** = The system should help users access previous consultation information and manage follow-up activities.
- **Profile and health information management** = Users should be able to maintain their personal and relevant health information.
- **Status overview** = The system should provide a centralized view of ongoing healthcare activities and their current status.

---

## Design Brief

### **Strategy**

- **Problem** = Routine health concerns can involve unnecessary travel, waiting, uncertainty, and fragmented healthcare processes.
- **Users** = Patients seeking convenient access to healthcare for routine or minor health concerns.
- **Goal** = Simplify the journey from identifying a health concern to receiving appropriate care and follow-up.
- **Value proposition** = Provide assessment, professional consultation, medication access, and health records through one connected platform.

### **Scope**

- **Core features** = Symptom assessment, symptom tracking, professional discovery, consultation, prescription management, medication access, order tracking, and health records.
- **Supporting features** = Payments, notifications, appointment management, and status tracking.
- **Priority** = Focus first on the complete routine-care journey from **symptom → assessment → consultation → prescription/medication → follow-up**.
- **Platform** = Web application using React and Next.js.

### **Structure**

- **Primary user flow** = Enter symptoms → Receive assessment → Select professional if required → Schedule consultation → Receive/manage prescription → Access medication → Track progress and follow-up.
- **Navigation** = Account → Health Assessment → Consultation → Medication → Prescription → Orders → Records.
- **System integration** = Connect healthcare, prescription, medication, payment, notification, and record functions into a continuous user journey.
- **Data flow** = User information and healthcare activities should remain connected across relevant stages.

### **Skeleton**

- **Information hierarchy** = Present the user's current health concern and next relevant action prominently.
- **Primary actions** = Enter symptoms, view assessment, find professional, schedule consultation, manage prescription, and access medication.
- **Navigation** = Provide consistent access to major healthcare functions and user records.
- **Layout** = Use clear forms, information cards, status indicators, progress trackers, and action controls.
- **Prototype focus** = Develop wireframes and low-fidelity layouts for the primary healthcare journey.

### **Surface**

- **Visual design** = Clean, professional, and reassuring healthcare-oriented interface.
- **Typography** = Clear and readable typography with consistent hierarchy.
- **Color** = A restrained healthcare-focused colour palette supporting clarity and trust.
- **UI elements** = Consistent buttons, icons, forms, cards, badges, status indicators, and navigation controls.
- **Interaction** = Clear feedback, understandable states, and consistent interaction patterns across the application.

---



