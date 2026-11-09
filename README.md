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

## Initial Ideation
Early concept directions validated and iterated through user studies and technical prototyping:

- **Conversational-first & Structured Hybrid Intake:** A dual-entry triage interface where users can describe issues in natural language or quickly select structured symptoms (e.g., headache, fever, cough) with 1–5 severity scoring and duration chips, drastically reducing cognitive and physical typing friction during acute illness.
- **"Who Reviewed This?" Clinical Credibility Gate:** Every health evaluation prominently features a dedicated verification badge detailing the evaluating licensed physician's registration number (e.g., State Medical Council / NMC), qualifications, and timestamp before recommendations or prescriptions are released.
- **Single Connected Horizontal Journey:** Unifying symptom entry, AI risk scoring, clinician consultation, e-prescription generation, pharmacy dispensing, and live courier tracking into one persistent, horizontally navigable care timeline rather than fragmented, siloed applications.
- **"Not Sure Yet" Clinical Escalation Pathway:** A persistent safety action allowing the user at any point during AI triage to instantly escalate to a live licensed practitioner, directly mitigating user anxiety and distrust in purely automated bots.
- **Household & Caregiver Profiles:** Fast, lightweight profile switcher enabling young working adults to manage pediatric or geriatric episodes for dependents with consent-bound digital records.
- **Recurring-Issue Express Shortcut:** Prior history recognition offering a streamlined intake path for verified repeat minor ailments (e.g., seasonal allergic rhinitis) that reuses baseline demographic and allergy context.

---

## Design Brief (Finalised)

### Strategy & Vision
- **Product Name & Classification:** Appie — Digital Healthcare Assistant (Web-First Responsive Application).
- **Core Purpose:** Enable time-poor urban working professionals and families in India to resolve routine, non-emergency health concerns (from initial symptom recognition to verified medical consultation and doorstep medication delivery) within a single, continuous, and clinically accountable digital loop.
- **Target Demographics:** Primary audience of young urban professionals aged 22–40 across Tier-1 and Tier-2 Indian cities, balancing intense work schedules with high digital literacy.
- **Value Proposition:** Eliminate 2–4 hours of lost productivity, travel friction, and waiting room exposure for routine ailments through clinically validated triage, rapid Telemedicine consultations, and cold-chain pharmaceutical fulfillment within 45 minutes.

### Scope & Guardrails
- **Included Scope (v1):**
  - Multi-modal symptom assessment (chat + structured chips + 1–5 severity scale).
  - Rule-assisted AI risk stratification with strict NMC Telemedicine Practice Guidelines (2020) red-flag escalation triggers.
  - Telemedicine consultation booking and encrypted video/chat communication with registered medical practitioners.
  - Tamper-proof, cryptographically sealed e-prescriptions conforming to NMC Section 6 and the IT Act 2000.
  - Closed-loop e-pharmacy checkout, cold-chain compliant logistics, and live doorstep GPS courier tracking.
  - Personal health record vault with DPDPA-compliant granular consent management.
  - Comprehensive accessibility suite (Dark Mode, High Contrast Mode with yellow text / cyan borders, Dyslexia Mode, and font scaling).
- **Out of Scope (v1):** Emergency trauma handling (immediate tertiary hospital redirect), invasive diagnostic ordering, specialized chronic oncology/cardiology marketplace, and direct narcotic/Schedule X dispensing.

### Operational & Legal Constraints
- **Telemedicine Practice Guidelines (NMC 2020):** Every prescription-triggering event mandates explicit human clinician sign-off; no prescription may be issued solely by automated AI algorithms.
- **Digital Personal Data Protection Act (DPDPA 2023):** Explicit purpose-bound consent for sharing health records with pharmacies and labs; complete right-to-forget and revocable data agreements.
- **CDSCO Drugs & Cosmetics Act:** Restricted to verified Over-The-Counter (OTC) and valid Schedule H/H1 e-prescriptions fulfilled by licensed retail pharmacies.

---

## Ideation and Conceptualization

### Conceptual Exploration Vectors
The ideation phase explored four distinct structural archetypes to bridge the gap between patient self-care and professional clinical intervention:

1. **Vector A: Chat-Only Bot Paradigm (Rejected)**
   - *Concept:* Pure conversational chatbot modeled after messaging apps.
   - *Evaluation:* While intuitive for intake, unstructured text inputs resulted in high ambiguity, excessive conversational turns, and significant user frustration when attempting to review complex multi-item medication orders or legal dispatches.
2. **Vector B: Aggregator Portal Paradigm (Rejected)**
   - *Concept:* Marketplace directory directing users outward to separate third-party clinics, pharmacies, and lab aggregators.
   - *Evaluation:* Reintroduced the exact fragmentation and context loss identified in contextual inquiry; users had to manually re-enter their symptoms and medical history across disconnected apps.
3. **Vector C: The Unified Closed-Loop Assistant (Selected & Finalised)**
   - *Concept:* A unified linear care pathway integrating symptom intake, AI clinical risk scoring, mandatory clinician review gate, e-prescription generation, and integrated e-pharmacy routing within a single coherent application frame.
   - *Evaluation:* Yielded the highest user confidence, lowest cognitive friction, zero data re-entry, and airtight regulatory compliance.

### Conceptual Brainstorming Matrix
| Dimension | Exploration Option 1 | Exploration Option 2 | Final Selected Concept (Appie) |
| :--- | :--- | :--- | :--- |
| **Symptom Input** | Free-form long text box | Exhaustive static dropdowns | Dynamic natural search + interactive severity tags (1–5) |
| **Clinical Review** | Async email report within 24h | Instant bot prescription (illegal) | Synchronous clinical safety gate with live consultation handoff |
| **Medication Access**| External prescription download | Partner clinic pickup only | 1-click cart transfer, CDSCO pharmacy validation & doorstep dispatch |
| **Navigation** | Deeply nested hierarchical menus | Separate standalone web apps | Horizontal sliding multi-pane window with persistent status tabs |

---

## Human Factors and Interaction Constraints Verified to the Final Concepts and Reiterating the Concepts

### Ergonomic, Cognitive, and Human Factor Analysis
Design decisions were evaluated against established human factors principles under the context of physical distress and acute cognitive impairment:

- **Cognitive Load Under Malaise (Sweller's Cognitive Load Theory):** When individuals experience fever, cephalalgia, or acute respiratory discomfort, executive working memory is severely compromised. Multi-stage nested menus and dense clinical jargon trigger decision paralysis.
  - *Design Reiteration:* Implemented progressive disclosure across the assessment flow, replacing open-ended diagnostic queries with recognized symptom chips, binary selectors, and visual numeric severity sliders.
- **Hick's Law in Clinician & Medication Discovery:** Minimizing decision time when choosing healthcare professionals and essential relief medicines.
  - *Design Reiteration:* Constrained doctor discovery to three primary criteria (Availability, Specialty, and Consultation Fee) and pre-filtered listings automatically based on the triage output.
- **Fitts's Law & Motor Ergonomics:** Motor accuracy decreases under fatigue or tremors.
  - *Design Reiteration:* Expanded touch/click targets for primary action controls (e.g., "Submit Symptoms", "Order Prescribed Medicines", "Proceed to Checkout") to a minimum hit target of `48px` height with `12px` border-radius and high visual hierarchy.
- **Trust & Affective Ergonomics (Norman's Emotional Design):** Visceral and reflective trust are essential in digital health.
  - *Design Reiteration:* Positioned the clinician's identity, State Medical Council registration, and official digital signature badge directly adjacent to clinical recommendations to eliminate visceral skepticism.

---

## Redefined Concepts Through All Possible Constraints

To make the conceptual model academically sound and technologically viable, every concept was redefined against legal, technical, clinical, and accessibility constraints:

```
[ Unconstrained Idea ] ─────────────> [ Constraint Filter ] ─────────────> [ Redefined Production Concept ]
Instant Autonomous Rx                NMC Telemedicine Guidelines          Mandatory Clinician Review Gate
Unrestricted Drug Delivery           CDSCO Schedule H / X Regulations     Verified E-Rx Fulfillable OTC/H Only
Complex Multi-Page Forms             Cognitive Malaise / Mobile Screens   Horizontal Sliding Window & Single Panes
Generic Standard Typography          Accessibility & Neurodiversity       High-Contrast Yellow/Cyan & Dyslexia Modes
Client-Side API Key Triage           Security / OWASP Top 10              Zero-Client Secrets & Server Rate-Limiting
```

1. **Autonomous AI Triage → Mandatory Clinician Gate:** Initial ideas of algorithmic self-medication were discarded. The redefined concept utilizes AI strictly for pre-triage data structuring and preliminary differential guidance, routing 100% of prescription decisions to licensed human practitioners.
2. **Standard High-Friction Form Layouts → Horizontal Sliding Window Panes:** Multi-page full reloads were redesigned into horizontal snap-sliding panes (`scroll-snap-type: x mandatory`). This enables users to effortlessly swipe or scroll horizontally across Cart, Active Tracking, and History within the exact same window.
3. **Accessibility Overhaul (High Contrast & Dyslexia Modes):** Real-world users include individuals with low vision, visual fatigue, and reading difficulties. Accessibility was redefined from passive compliance into an active theme suite offering high-contrast vivid yellow text (`#ffff22`) with cyan/green borders (`#00e5a3`) and a unified-weight Dyslexia-friendly typography mode.
4. **Zero-Trust Security & Rate-Limiting:** All user inputs across search and registration are rigorously validated through server-side Zod schemas with string sanitizers to prevent SQL injection, Cross-Site Scripting (XSS), and LLM prompt injection, combined with Upstash/in-memory rate limiting.

---

## Show Clear Information Architecture with Clear Navigation Structure

### Information Architecture (IA) Hierarchy

```
Appie Platform (Root)
│
├── 0.0 Landing & Discovery (Public)
│   ├── Minimal Header (Brand Logo + Sign In)
│   ├── Value Proposition & Clinical Safeguard Hero
│   ├── Video Demonstration Showcase (Horizontally Sliding MP4 Viewport)
│   └── Trust & Compliance Badges (NMC, CDSCO, 256-Bit Encryption)
│
├── 1.0 Authentication & Identity Management
│   ├── Unified Sign In (Role Tabs: Patient | Doctor | Pharmacist | Delivery)
│   ├── Patient Registration & Profile Onboarding
│   ├── Healthcare Partner Onboarding (Doctor, Pharmacy, Logistics)
│   └── Password Recovery & Secure Session Management
│
├── 2.0 Health Assessment System (Patient Portal)
│   ├── 2.1 Symptom Search & Tag Explorer
│   ├── 2.2 Severity Scoring Grid (1 to 5 Scale + Duration Tags)
│   ├── 2.3 Medical AI Evaluation Engine
│   │   ├── Clinical Urgency Stratification (Emergency | Urgent | Routine)
│   │   ├── Differential Care Considerations & Home Measures
│   │   └── Recommended Over-The-Counter / Prescription Classes
│   └── 2.4 Clinician Handoff Router
│
├── 3.0 Consultation & Telehealth System
│   ├── 3.1 Doctor Discovery (Filters: Speciality, Fee, Experience, Rating)
│   ├── 3.2 Appointment Scheduler (Date, Slot, Consultation Mode)
│   └── 3.3 Telemedicine Consultation Room (Secure Audio/Video/Chat)
│
├── 4.0 Prescription & Clinical Documentation System
│   ├── 4.1 E-Prescription Viewer (Rx Details, Digital Signature, NMC Seal)
│   ├── 4.2 Document Export Actions (System Print, Text/PDF Download, Share Link)
│   └── 4.3 1-Click Cart Transfer Pipeline
│
├── 5.0 Medication & E-Pharmacy System
│   ├── 5.1 CDSCO-Verified Medicine Catalog & Detailed Modals
│   ├── 5.2 Real-Time Pharmacy Cart Management
│   └── 5.3 Checkout & Simulated Payment Gateway (UPI, Card, NetBanking)
│
├── 6.0 Orders & Logistics Tracking System (Horizontal Sliding Architecture)
│   ├── Pane 1: Current Cart (Items, Subtotal, Checkout Action)
│   ├── Pane 2: Active Delivery (Live Milestones, Interactive GPS Map, Courier Beacon)
│   └── Pane 3: Order History Log (Search, Sort, Multi-Status Filtering)
│
├── 7.0 Medical Records & Health Vault System (Horizontal Sliding Architecture)
│   ├── Pane 1: Past Health Assessments
│   ├── Pane 2: Consultation History & Physician Summaries
│   └── Pane 3: Encrypted Clinical Document Vault (Upload & Download Tests/Vaccines)
│
├── 8.0 Account & Accessibility Management
│   ├── Profile Details & Emergency Contact Configuration
│   ├── DPDPA Consent Registry
│   └── Accessibility Suite (Dark/Light Mode, High Contrast Mode, Dyslexia Mode, Font Scaling)
│
└── 9.0 Role-Specific Dashboards
    ├── 9.1 Doctor Dashboard (Appointment Queue, Triage Review, E-Rx Issuer)
    ├── 9.2 Pharmacist Dashboard (Order Verification, Dispensing Queue, Inventory)
    └── 9.3 Delivery Partner Dashboard (Route Allocation, Stage Transition, Proof of Delivery)
```

### Persistent Navigation Structure
- **Global Header (Authenticated):**
  `[Brand Logo: Appie]` ── `[Health Assessment]` ── `[e-Pharmacy]` ── `[Orders]` ── `[e-Prescriptions]` ── `[Records]` ── `[Profile]` ────────── `[Notification Bell]` `[Settings]`
- **Sub-Navigation within Multi-Section Modules (Assessment, Orders, Records):**
  Implemented using segmented pill button tabs with real-time active indicators, coupled with touch/scroll snap-points that allow smooth horizontal sliding between functional panes within the same viewport.

---

## Low-Fidelity Wireframes

```
========================================================================================
WIRE-01: LANDING PAGE (MINIMAL DISTRACTION-FREE VIEWPORT)
========================================================================================
+--------------------------------------------------------------------------------------+
| [Rx Appie]                                                                 [Sign In] |
+--------------------------------------------------------------------------------------+
|                                                                                      |
|                               ( * Sparkles Badge * )                                 |
|                       Next-Generation Healthcare Intelligence                        |
|                                                                                      |
|                Your Medical Assistant for Patients and Doctors Alike                 |
|                                                                                      |
|   Appie streamlines routine healthcare by uniting intelligent symptom assessment,    |
|       verified clinician consultations, and doorstep medicine delivery.              |
|                                                                                      |
|             [ Get Started as Patient -> ]      [ Join Healthcare Network ]           |
|                                                                                      |
|     +--------------------------------------------------------------------------+     |
|     |  [<]  SLIDING DEMONSTRATION WINDOW: MP4 LIVE CARE WALKTHROUGH        [>] |     |
|     |       Video Feed: AI Triage -> Video Consult -> Pharmacy Dispatch        |     |
|     +--------------------------------------------------------------------------+     |
|                                                                                      |
|     [ 99.2% Triage Match ]  [ <15m Consult Dispatch ]  [ 100% CDSCO Verified ]       |
+--------------------------------------------------------------------------------------+

========================================================================================
WIRE-02: HEALTH ASSESSMENT & CONSULTATIONS (DUAL-MODE SLIDING WINDOW)
========================================================================================
+--------------------------------------------------------------------------------------+
| [Appie]  Assessment | e-Pharmacy | Orders | e-Prescriptions | Records | Profile (Bell)(Set) |
+--------------------------------------------------------------------------------------+
|                                                                                      |
|  [ * 1. Health Assessment * ]     [ 2. Consultations (12) ]                          |
|                                                                                      |
|  +--------------------------------------------------------------------------------+  |
|  | [ Search symptoms by name or body region...                                  ] |  |
|  | [ + Dry Cough ] [ + Low Fever ] [ + Sore Throat ] [ + Headache ] [ + Nausea ]   |  |
|  +--------------------------------------------------------------------------------+  |
|                                                                                      |
|  ACTIVE SYMPTOMS SELECTED (2):                                                       |
|  +--------------------------------------------------------------------------------+  |
|  | Dry Cough          Severity: [ 1 ] [ 2 ] [ (3) ] [ 4 ] [ 5 ]   [ x Remove ]    |  |
|  | Low Fever (100°F)  Severity: [ 1 ] [ 2 ] [ 3 ] [ (4) ] [ 5 ]   [ x Remove ]    |  |
|  +--------------------------------------------------------------------------------+  |
|                                                                                      |
|  [ Evaluate Symptoms with Medical AI ] ───────────> [ Connect Directly to Doctor ]  |
|                                                                                      |
|  ============================== TRIAGE RESULT ====================================   |
|  | Urgency Level: [ ROUTINE CARE ]                  Calculated Confidence: 94%     |  |
|  | Primary Consideration: Acute Viral Upper Respiratory Infection                   |  |
|  | Clinical Summary: Symptoms indicate mild self-limiting viral infection.          |  |
|  | Recommended OTC: Paracetamol 650mg, Cetirizine 10mg, Warm saline gargles.       |  |
|  | [ Transfer to Doctor for E-Rx ]          [ Order Recommended OTC to Cart ]      |  |
|  +--------------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------+

========================================================================================
WIRE-03: ORDERS & DELIVERIES (HORIZONTAL SLIDING SNAP-CONTAINER)
========================================================================================
+--------------------------------------------------------------------------------------+
| [Appie]  Assessment | e-Pharmacy | Orders | e-Prescriptions | Records | Profile (Bell)(Set) |
+--------------------------------------------------------------------------------------+
|  Orders & Deliveries                                                                 |
|  [ 🛒 1. Current Cart (2) ]  [ 🚚 2. Active Delivery (LIVE) ]  [ 📦 3. History (5) ]  |
|                                                                           [<] [>]    |
|  +--------------------------------------------------------------------------------+  |
|  | <<< HORIZONTALLY SCROLLABLE SNAP WINDOW >>>                                    |  |
|  |                                                                                |  |
|  | [ PANE 1: CART ]           [ PANE 2: ACTIVE DISPATCH ]      [ PANE 3: LOG ]    |  |
|  | • Dolo 650 (x1) - Rs.32    | Order: ORD-2026-9812           | • ORD-9402       |  |
|  | • Cetzine (x1)  - Rs.21    | Status: [ DELIVERING ]         |   Delivered      |  |
|  | -----------------------    | Stages: (1)✓ (2)✓ (3)● (4)○    |   Rs. 180.00     |  |
|  | Subtotal: Rs. 53.00        | [ LIVE GPS MAP CANVAS ]        | • ORD-8819       |  |
|  | [ Proceed to Checkout ]    | Origin (Pharm) -> 🛵 -> Home   |   Delivered      |  |
|  |                            | Rider: Arun (+91 97410 99882)  |   Rs. 320.00     |  |
|  |                            | [ View Full Tracking Log ]     | [ Details ]      |  |
|  +--------------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------+

========================================================================================
WIRE-04: E-PRESCRIPTION OFFICIAL VIEWER (TAMPER-PROOF CLINICAL MODAL)
========================================================================================
+--------------------------------------------------------------------------------------+
|  [X Close]                                                                           |
|  ℞ APPIE HEALTHCARE • TELEMEDICINE E-PRESCRIPTION                                   |
|  Doctor: Dr. Ananya Sharma, MBBS, MD (Reg #KMC-48291)         Rx ID: RX-2026-8841    |
|  Patient: Aditya Verma (Age: 29)                              Date: 09 Nov 2026      |
|  Diagnosis: Acute Viral Upper Respiratory Infection           Valid: 30 Days         |
|  ----------------------------------------------------------------------------------  |
|  PRESCRIBED MEDICINES:                                                               |
|  1. Dolo 650mg (Paracetamol) ── 1 tab thrice daily after food (1-1-1) ── 5 Days      |
|  2. Cetzine 10mg (Cetirizine) ── 1 tab at night (0-0-1) ─────────────── 5 Days      |
|                                                                                      |
|  ADVICE: Hydration, steam inhalation twice daily. Escalate if fever > 102°F.        |
|  ----------------------------------------------------------------------------------  |
|  [✓] Digitally Signed by Dr. Ananya Sharma           [ QrCode: Tamper-Proof Verified ]|
|  SIG: 7f8a9e2d...e829 (Valid under IT Act 2000 & NMC Guidelines)                     |
|                                                                                      |
|  [ 🖨️ Print ] [ ⬇️ Download ] [ 🔗 Share ]    [ 🛒 Order Prescribed Medicines to Cart ]|
+--------------------------------------------------------------------------------------+
```

---

## Feature Reiteration on Screens

Every screen was reiterated based on user study feedback, heuristic evaluations, and operational edge-cases:

1. **Symptom Entry & Assessment Screen:**
   - *Initial Concept:* Standard free-text prompt without severity indicators.
   - *Reiteration:* Added interactive quick-select category pills, real-time tag matching, and an inline 1-to-5 severity selector that directly feeds into the risk stratification model. An instantaneous fallback CTA ("Connect Directly with Doctor") was integrated into the top bar to provide an immediate escape hatch for anxious users.
2. **Consultation Scheduling Screen:**
   - *Initial Concept:* Multi-step calendar redirecting to external payment gateways.
   - *Reiteration:* Integrated slot booking and patient symptom attachment directly inside a unified modal with live clinician availability indicators, slot selectors, and instantaneous dummy payment simulation.
3. **E-Prescription Viewer Screen:**
   - *Initial Concept:* Static read-only table of medication names.
   - *Reiteration:* Upgraded into an official legal digital certificate with tamper-proof cryptographic checksum badges, printable PDF export routines, downloadable text certificates, and an instant "Order Prescribed Medicines to Cart" action that maps medications directly to the pharmacy catalog.
4. **Orders & Deliveries Screen:**
   - *Initial Concept:* Three disconnected vertical sections requiring extensive vertical scrolling.
   - *Reiteration:* Unified into a single horizontal sliding window with snap navigation (`cart` → `active` → `history`), top-level status pills, manual chevron navigation controls, and an interactive simulated GPS map canvas.
5. **Medical Records & Vault Screen:**
   - *Initial Concept:* Single chronological list combining all record types.
   - *Reiteration:* Re-architected into three horizontal panes separating structured AI triage assessments, physician video consult summaries, and an encrypted health vault supporting on-demand document upload and download.
6. **Authentication & Partner Registration:**
   - *Initial Concept:* Generic single email login form.
   - *Reiteration:* Multi-role tabbed interface (Patient, Doctor, Pharmacist, Delivery Partner) featuring 1-click credential demo fills, styled emerald green status badges, and automated session cookie provisioning.

---

## Screen Layouts and Grid Systems

Appie's digital product detailing adheres to an 8-point spatial grid system optimized for modern high-DPI desktop and responsive viewports.

### Breakpoints & Layout Containers
- **Max Content Container:** `1150px` width, centered with `margin: 0 auto`.
- **Horizontal Viewport Padding:** Desktop `2rem` (32px), Tablet `1.5rem` (24px), Mobile `1rem` (16px).
- **Spatial Grid Base:** `8px` increments (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
- **Card Padding Hierarchy:**
  - Compact Cards: `1rem` (16px)
  - Standard Linear Dashboard Cards: `1.25rem 1.5rem` (20px 24px)
  - Modals & Viewport Containers: `2rem` to `2.25rem` (32px to 36px)

### CSS Grid & Flexbox Structures
- **Dashboard & Metric Strips:** `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;`
- **Linear Feed Cards:** `display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;`
- **Horizontal Sliding Window Panes:**
  ```css
  .sliding-window-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 2rem;
    scrollbar-width: thin;
  }
  .sliding-pane {
    min-width: 100%;
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
  ```

---

## Typography and Color Specifications

### Typography Hierarchy

The typography scale utilizes modern system-rendered sans-serif typefaces (`Inter`, `Segoe UI`, `-apple-system`, `Roboto`, `sans-serif`) ensuring zero layout-shift, sharp text rendering on all displays, and complete accessibility under dyslexia mode.

| Style Role | Font Size (Desktop) | Line Height | Font Weight | Tracking | Letter Color (Dark Mode) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `2.5rem` – `3rem` (40–48px) | 1.15 | 800 (Extra Bold) | `-0.025em` | `var(--text-primary)` (`#f4f4f5`) |
| **Section Title H2** | `1.85rem` – `2.0rem` (30–32px) | 1.25 | 800 (Bold) | `-0.02em` | `var(--text-primary)` (`#f4f4f5`) |
| **Card Heading H3** | `1.25rem` – `1.35rem` (20–22px) | 1.35 | 700 (Semi Bold) | `-0.01em` | `var(--text-primary)` (`#f4f4f5`) |
| **Sub-heading H4** | `1.05rem` – `1.15rem` (17–18px) | 1.4 | 700 (Semi Bold) | `0em` | `var(--text-primary)` (`#f4f4f5`) |
| **Body Primary** | `0.92rem` – `0.95rem` (15px) | 1.55 | 500 (Regular) | `0em` | `var(--text-secondary)` (`#a1a1aa`) |
| **Supporting / Meta** | `0.78rem` – `0.85rem` (12–14px) | 1.4 | 500 (Medium) | `+0.01em` | `var(--text-muted)` (`#71717a`) |
| **Micro Badges / Code**| `0.72rem` – `0.75rem` (11–12px) | 1.2 | 700 / Monospace | `+0.04em` | Semantic Variable |

### Color Specifications & Design Tokens

```
PRIMARY PALETTE:
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Deep Base (Dark)        │ Card Surface            │ Primary Accent Teal     │
│ #09090b                 │ #18181b                 │ #0d9488                 │
│ var(--bg-base)          │ var(--bg-card)          │ var(--color-primary)    │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘

ACCENT & SEMANTIC PALETTE:
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Warm Amber Gold         │ Clinical Emerald Green  │ Escalation Red          │
│ #ffb200                 │ #10b981                 │ #ef4444                 │
│ var(--color-accent)     │ var(--color-success)    │ var(--color-error)      │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘

HIGH-CONTRAST ACCESSIBILITY OVERRIDE:
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ High-Contrast Text      │ High-Contrast Borders   │ High-Contrast Card Bg   │
│ #ffff22 (Vivid Yellow)  │ #00e5a3 (Cyan / Green)  │ #0d151a (Pure Contrast) │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

- **Base Background:** `#09090b` (Deep Near-Black charcoal).
- **Surface Elevation:** `#111114` (Layer 1), `#18181b` (Card Background).
- **Borders:** Subtle `#27272a`, Medium `#3f3f46`, Strong `#52525b`.
- **Brand Teal Accent:** `#0d9488` (Primary brand tone, clinical credibility).
- **Functional Amber Gold:** `#ffb200` (Call-to-actions, active indicators, ratings).
- **Semantic Green (Success/Verified):** `#10b981` (Background: `rgba(16, 185, 129, 0.12)`).
- **Semantic Red (Emergency/Error):** `#ef4444` (Background: `rgba(239, 68, 68, 0.12)`).

---

## Spacing and Sizing Details

### Layout Sizing Constants
- **Header Height:** `72px` fixed sticky navigation bar with blur backdrop filter (`blur(12px)`).
- **Interactive Buttons:**
  - Primary Action CTA: `min-height: 48px; padding: 0 1.5rem; font-size: 0.95rem; font-weight: 700;`
  - Secondary Action / Filter Buttons: `min-height: 42px; padding: 0 1rem; font-size: 0.88rem; font-weight: 600;`
  - Compact Action Controls: `min-height: 36px; padding: 0 0.85rem; font-size: 0.8rem;`
  - Icon Toggle Buttons: `42px × 42px` square with `border-radius: 10px`.
- **Form Input Fields:** `min-height: 46px; border-radius: 10px; padding: 0 1rem; font-size: 0.92rem; border: 1.5px solid var(--border-subtle);`
- **Border Radii Hierarchy:**
  - Micro Tags & Pills: `6px` to `8px`
  - Input Fields & Action Buttons: `10px` to `12px`
  - Cards & Sliding Panes: `16px`
  - Dialog Modals & Showcase Viewports: `20px` to `24px`

---

## Components Used and Their Creation

Appie is engineered with a modular, atomic component hierarchy built with React 19, TypeScript, and Lucide icons:

```
              ┌────────────────────────────────────────────────┐
              │           ATOMIC UI COMPONENTS                 │
              │  (Button, Input, Tag, Badge, IconBox, Divider) │
              └───────────────────────┬────────────────────────┘
                                      │
              ┌───────────────────────▼────────────────────────┐
              │          MOLECULAR PATTERN UNITS               │
              │   (SymptomChip, DoctorCard, OrderItemRow,      │
              │    TimelineMilestone, NotificationBell)        │
              └───────────────────────┬────────────────────────┘
                                      │
              ┌───────────────────────▼────────────────────────┐
              │          ORGANISM & MODAL MODULES              │
              │  (PrescriptionViewerModal, OrderTrackingModal, │
              │   OrderCheckoutModal, LiveMapCanvas, TopBar)   │
              └───────────────────────┬────────────────────────┘
                                      │
              ┌───────────────────────▼────────────────────────┐
              │          PAGE-LEVEL SLIDING TEMPLATES          │
              │   (AssessmentView, OrdersSlidingView,          │
              │    RecordsVaultView, PharmacistDashboard)      │
              └────────────────────────────────────────────────┘
```

1. **`PrescriptionViewerModal.tsx`:** Modal rendering a legally compliant NMC e-prescription. Includes dynamic print styling triggers (`window.print()`), automated formatted plain-text and PDF document blob export (`handleDownload`), clipboard link verification sharing (`handleShare`), and cryptographic registry inspection badges.
2. **`OrderTrackingModal.tsx` & `OrderListComponent.tsx`:** Logistics trackers combining vertical milestone progression with an interactive SVG GPS route canvas. Shows animated courier beacons, origin dispensary tags, delivery destination pins, and demo stage simulation triggers (`handleSimulateAdvance`).
3. **`OrderCheckoutModal.tsx`:** Simulated payment gateway and address collector. Handles real-time coupon calculation (`APPIE50`), multi-channel payment method switches (UPI, Credit/Debit, NetBanking), and order creation pipeline.
4. **`MedicalStatusVerificationView.tsx`:** Clinician credential verification center supporting drag-and-drop document upload simulation, registration number auditing, and single-click demo NMC Registry approval triggers (`handleSimulateApproval`).
5. **`HealthAssessmentAndConsultationView.tsx`:** Multi-tiered triage organism linking searchable symptoms, severity scoring, Gemini AI/rule-based clinical evaluation, and direct specialty doctor discovery.
6. **`SettingsOverviewView.tsx`:** Preference management hub providing instant reactivity for Dark/Light mode, High Contrast Yellow/Cyan mode, Dyslexia typography mode, and text scaling (`16px`, `17.5px`, `19px`) via `localStorage` and server sync.

---

## Redefining Micro Interactions and Transition Specifications

To avoid abrupt interface shifts and maintain user calm during medical workflows, micro-interactions follow strict physical easing parameters:

- **Standard State Transitions:** `all 200ms cubic-bezier(0.16, 1, 0.3, 1)` applied to button hovers, border color highlights, and pill background shifts.
- **Card Hover Elevation:**
  `transform: translateY(-2px); box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.35), 0 0 16px 1px var(--accent-glow);`
- **Modal Backdrops & Overlays:**
  `background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px); animation: fadeIn 250ms ease;`
- **Live Courier Radar Ping:**
  Pulsing animation on the transit route map beacon using CSS keyframe expansion:
  `@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`
- **Horizontal Pane Snap-Sliding:**
  Using CSS scroll snap (`scroll-snap-type: x mandatory; scroll-behavior: smooth`) allowing trackpad gesture translation with zero dropped frames.
- **Reduced Motion Accessibility Safeguard:**
  When reduced-motion is toggled, all animation and transition durations are instantly clamped to `0.001ms` via `.reduced-motion *` rules in `globals.css`.

---

## Screen-by-Screen Specifications

### 1. Landing Screen (`/`)
- **Header:** Minimal header displaying the Appie brand logomark on the left and a quick "Sign In" button with `LogIn` icon on the right.
- **Hero Section:** Clear title and subtext communicating patient and doctor capabilities, with two primary CTAs: "Get Started as Patient" and "Join Healthcare Network".
- **Sliding Video Demonstration Showcase:** Horizontally sliding MP4 video viewport presenting live product capabilities (Assessment, Consultation, Pharmacy).
- **Proof Strip:** Verified Clinicians, CDSCO Sourced Medicines, Express Doorstep Dispatch.

### 2. Authentication Screen (`/login`)
- **Role Tabs:** Segmented switcher for Patient, Doctor, Pharmacist, and Delivery Partner.
- **Quick Demo Fill:** 1-click test credentials bar auto-populating email and password for immediate evaluation.
- **Status Alerts:** Refined emerald green checkmark card with `#10b981` text and soft background confirming successful authentication and automated dashboard redirection.

### 3. Health Assessment Screen (`/assessment`)
- **Horizontal Mode Switcher:** Pill tabs to alternate between AI Assessment and Doctor Consultations.
- **Symptom Input:** Live search filter over a clinical catalog, tag picker, and 1-to-5 severity indicator.
- **Triage Result Display:** Urgency classification banner, clinical differential summary, recommended OTC medications, and direct transfer buttons.

### 4. Orders & Deliveries Screen (`/orders`)
- **Navigation Controls:** `[ 🛒 1. Current Cart ]` ── `[ 🚚 2. Active Delivery ]` ── `[ 📦 3. Order History ]` with Left/Right chevrons.
- **Pane 1 (Cart):** Itemized breakdown, quantity modifiers, subtotal, and checkout CTA.
- **Pane 2 (Active Delivery):** Live 4-stage progression, courier details, and real-time SVG transit map canvas.
- **Pane 3 (History):** Search bar, sort modal (date, amount), filter modal (ordered, collecting, delivering, delivered, failed), and order item rows.

### 5. Medical Records & Health Vault Screen (`/records`)
- **Navigation Controls:** `[ ✨ 1. Health Assessments ]` ── `[ 🩺 2. Consultations ]` ── `[ 📁 3. Health Vault ]`.
- **Pane 1:** Historical AI assessment records with urgency tags and detailed triage modals.
- **Pane 2:** Historical doctor consultations, appointment times, reasons, payment statuses, and prescription links.
- **Pane 3:** Document vault listing encrypted files (Blood test, COVID vaccine, X-ray) with direct download actions and an interactive upload modal.

### 6. E-Prescriptions Screen (`/prescriptions`)
- **Patient View:** List of digitally signed e-prescriptions with validation dates, diagnoses, and "View Official E-Rx" actions.
- **Doctor View:** Dedicated "Issue New E-Prescription" creator with diagnosis fields, medicine picker, dosage rules, and digital signature sealing.
- **Modal Viewer:** Tamper-proof verification certificate, print action, text/PDF download, link sharing, and 1-click cart transfer.

### 7. Professional & Partner Dashboards
- **Doctor Dashboard (`/professional/home`):** Pending consultation queue, triage review, tele-consult launcher, and prescription authoring.
- **Pharmacist Dashboard (`/pharmacist/home`):** Real-time order dispatch feed, item checklist verification, batch compliance checks, and catalog inventory table.
- **Delivery Partner Dashboard (`/delivery/home`):** Assigned doorstep deliveries, pickup confirmation, delivery milestone advancing, and proof-of-delivery confirmation.

---

## High-Fidelity Interactive Prototype

The high-fidelity interactive prototype of Appie is fully realized as a production Next.js 16 web application running with responsive client-side hydration, server components, and active API routing:

- **Live Repository:** [GitHub - RishikNatra/Appie](https://github.com/RishikNatra/Appie)
- **Local Prototype Execution:**
  ```bash
  # 1. Clone repository
  git clone https://github.com/RishikNatra/Appie.git
  cd Appie

  # 2. Install dependencies
  npm install

  # 3. Launch interactive development prototype
  npm run dev
  # Access live prototype at http://localhost:3000
  ```
- **Demo Interactive Personas (1-Click Authenticated in Login):**
  - **Patient Persona:** `patient@appie.health` / `Password123!` (Full assessment, cart checkout, horizontal orders & records)
  - **Doctor Persona:** `doctor@appie.health` / `Password123!` (Review triage, issue digital e-prescriptions, simulate NMC credential verification)
  - **Pharmacist Persona:** `pharmacist@appie.health` / `Password123!` (Inspect incoming pharmacy dispatches, verify medicine batches)
  - **Delivery Partner Persona:** `delivery@appie.health` / `Password123!` (Advance live package milestones from transit to delivered)

---

## Cognitive Walkthrough and Comparison with Existing Product and Show How Better It Is

### Cognitive Walkthrough (CW) Methodology & Persona
A systematic cognitive walkthrough was conducted evaluating the primary user persona: **Aditya, a 29-year-old software engineer in Bengaluru suffering from acute headache, fever (100.8°F), and mild cough during a demanding work sprint.**

The walkthrough assesses four core questions for each user action step:
1. *Will the user try to achieve the right effect?*
2. *Will the user notice that the correct action is available?*
3. *Will the user associate the correct action with the effect they are trying to achieve?*
4. *If the correct action is performed, will the user see that progress is being made toward their goal?*

#### Step-by-Step Cognitive Walkthrough Analysis

| User Task Step | User Intent & Goal | Action Performed | System Feedback & Progress Cue | Cognitive Walkthrough Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1: Symptom Intake** | Document illness without typing essays | Enters "cough" in search; clicks "Dry Cough" and sets Severity to 3 | Chip animates into selected tray with highlighted severity score | **Success:** Zero ambiguity; quick-select chips eliminate typing effort under fever. |
| **Step 2: AI Triage Review** | Understand if illness is dangerous | Clicks "Evaluate Symptoms with Medical AI" | Immediate status badge displays "ROUTINE CARE" with clinical summary | **Success:** Visceral anxiety eliminated; clear next steps visible within 2 seconds. |
| **Step 3: Clinician Consultation** | Obtain verified doctor advice | Clicks "Transfer to Consultation" | Automatically filters doctors by General Medicine; selects slot | **Success:** Doctor's credentials and NMC registration prominently displayed, establishing trust. |
| **Step 4: E-Prescription Delivery** | View legal prescription | Receives notification; opens E-Prescription viewer | Formatted Rx displayed with doctor's signature and NMC seal | **Success:** User immediately recognizes valid legal document; zero waiting. |
| **Step 5: Medication Fulfillment** | Get prescribed medicine delivered | Clicks "Order Prescribed Medicines to Cart" then "Proceed to Checkout" | Cart transfers automatically; orders window smoothly slides to Active Delivery | **Success:** Zero re-entry of drug names; simulated payment completes in 1 click. |
| **Step 6: Live Transit Tracking** | Know exact arrival time | Views active pane on Orders page | Interactive GPS route displays live courier icon 5 mins away | **Success:** Complete transparency from intake to physical delivery. |

---

### Comparative Evaluation: Appie vs. Existing Market Alternatives

```
HEALTHCARE PROCESS COMPLETION (CLOSED-LOOP BENCHMARK):
┌────────────────────┬───────────┬──────────────┬─────────────┬─────────────┐
│ Workflow Stage     │ Appie     │ Practo       │ Tata 1mg    │ Apollo 24|7 │
├────────────────────┼───────────┼──────────────┼─────────────┼─────────────┤
│ 1. AI Symptom      │ ✓ Core    │ ✗ None       │ ◐ Fragmented│ ◐ Generic   │
│    Triage & Scoring│ (Instant) │              │   Search Bot│   Question  │
├────────────────────┼───────────┼──────────────┼─────────────┼─────────────┤
│ 2. Clinician Gate  │ ✓ Built-in│ ✓ Video Only │ ✓ Telehealth│ ✓ Telehealth│
│    Verification    │ Mandatory │   Manual     │   Manual    │   Manual    │
├────────────────────┼───────────┼──────────────┼─────────────┼─────────────┤
│ 3. 1-Click Rx to   │ ✓ Instant │ ✗ Disconnect │ ◐ Manual Rx │ ◐ Re-upload │
│    Pharmacy Cart   │   Transfer│   Re-upload  │   Search    │   Required  │
├────────────────────┼───────────┼──────────────┼─────────────┼─────────────┤
│ 4. Doorstep Transit│ ✓ Live GPS│ ✗ Third-Party│ ✓ Delayed   │ ✓ Courier   │
│    Tracking        │   Map Sim │   Courier    │   Tracking  │   Updates   │
├────────────────────┼───────────┼──────────────┼─────────────┼─────────────┤
│ 5. UX Architecture │ ✓ Single  │ ✗ Deeply     │ ✗ Cluttered │ ✗ Heavy Ad  │
│    & Accessibility │ Horizontal│   Nested     │   Commercial│   Banners & │
│                    │   Window  │   Menus      │   Storefront│   Promos    │
└────────────────────┴───────────┴──────────────┴─────────────┴─────────────┘
```

### Detailed Competitive Differentiators: How Appie is Substantially Better

1. **Closed-Loop Unity vs. Broken Silos:**
   - *Existing Products (Practo, 1mg, Apollo):* Treat consultations, diagnostic lab orders, and pharmacy sales as disjointed commercial business units. A user consulting a doctor on Practo receives a static PDF and must independently open a pharmacy app, search for each medication, decipher doctor abbreviations, or wait for manual prescription digitizers.
   - *Appie Advantage:* Connects the entire journey into an unbroken continuum. A doctor's issued prescription features an instant `[Order Prescribed Medicines to Cart]` button that maps verified dosages straight to local pharmacy inventory, routing directly into checkout in one click.
2. **Clinical Accountability vs. Black-Box AI Bots:**
   - *Existing Products:* Either lack symptom assessment entirely (forcing users to guess whether they need an ENT, Pulmonologist, or GP), or deploy generic chatbots that offer vague disclaimers without clinical backing.
   - *Appie Advantage:* Pairs intelligent AI symptom risk-scoring with a mandatory human clinician review gate. The user receives immediate preliminary peace-of-mind, while legal prescription generation remains strictly accountable to verified NMC-registered medical practitioners.
3. **Calm, High-Efficiency Product UX vs. Aggressive Commercial Clutter:**
   - *Existing Products:* Overwhelmed with promotional discounts, lab test upsells, sponsored hospital banners, and cosmetic wellness products that induce visual stress during acute illness.
   - *Appie Advantage:* Employs a restrained, distraction-free aesthetic with an ambient dark palette, generous whitespace, zero commercial advertising banners, and single-window horizontal sliding panes that keep the patient focused exclusively on recovery.
4. **Inclusive Neurodiversity & Visual Accessibility:**
   - *Existing Products:* Standard interfaces with no contrast adjustments, fixed low-contrast font sizes, and dense blocks of text that alienate users with visual impairments or reading difficulties.
   - *Appie Advantage:* First-in-class integrated accessibility suite featuring a vibrant **High Contrast Mode** (Yellow `#ffff22` text on vivid Cyan/Green `#00e5a3` borders) and a specialized **Dyslexia Mode** enforcing uniform dyslexia-friendly typography and consistent stroke weight throughout the application.
