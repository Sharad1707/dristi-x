# Drishti-XAI User Manual

## 1. Purpose

Drishti-XAI is an AI-assisted diabetic-retinopathy screening prototype. It helps a healthcare worker organize a retinal-image screening, review model-generated indicators, and prepare a case for ophthalmologist review.

The system is a decision-support tool. It does not replace a qualified clinician and does not provide a final diagnosis or treatment plan.

## 2. Open the Application

### Local development

Run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, normally `http://localhost:5173/`.

## 3. Sign In or Sign Up

The application opens on the authentication page.

### Sign in

Enter a work email and password, then select **Sign in securely**. In the current prototype, any valid-looking email and a password with at least six characters will open the workspace.

### Sign up

Select the **Sign up** tab and provide:

- Full name
- Work email
- Password
- Privacy-terms consent

The prototype accepts the form locally and does not create a real account.

### Demo workspace

Select **Continue with demo workspace** to enter the application immediately. This is the recommended path for demonstrations.

The current authentication screen is only a UI and workflow prototype. It does not provide real password storage, session security, email verification, password recovery, or role-based access. A production deployment must connect it to a secure authentication service.

### Production preview

```bash
npm run build
npm run preview
```

## 3. Navigation

The left navigation contains five workspaces:

### Overview

Shows clinic-level activity:

- Screenings completed
- Cases awaiting clinical review
- Image-quality pass rate
- Daily operational activity

Use **Open screening** to move to the screening workflow.

### Patients

Shows the patient directory with:

- Patient name and ID
- Age
- Last screening time
- Screening status
- Open action

Use the search field to find a patient by name or ID. Select **Open** on a patient to return to the screening workspace.

### Screening

This is the primary workflow for uploading an image and reviewing the simulated result.

### Review queue

Shows cases requiring clinician attention. Each item includes the patient, the reason for review, and an action button to return to screening.

### Reports

Shows screening totals, referral activity, reports awaiting sign-off, and a clinical governance note.

## 4. Start a Screening

1. Open **Screening** from the left navigation.
2. Confirm the active patient information.
3. Review the screening reason and patient notes.
4. Upload a retinal fundus image by either:
   - Clicking the upload area and selecting a JPG, PNG, or SVG file.
   - Dragging an image into the upload area.
   - Selecting one of the sample cards.
5. Confirm that the selected image appears as ready.
6. Select **Run quality check**.

## 5. Sample Image Library

The upload screen includes three sample cards:

- Synthetic fundus demo: suitable for demonstrating the fundus workflow.
- Eye reference 01: external-eye reference photograph.
- Eye reference 02: external-eye reference photograph.

The external-eye photographs are included for interface demonstration only. They are not retinal fundus images and must not be used for diabetic-retinopathy inference, clinical decisions, or model evaluation.

For real model development, use a properly licensed retinal fundus dataset such as IDRiD or APTOS and follow its terms of use.

## 6. Review the Screening Report

After analysis, the application displays a preliminary AI-assisted report.

### Clinical review banner

This banner indicates that the result requires confirmation by a qualified ophthalmologist.

### Image review

The image section displays:

- The selected fundus or sample image
- A simulated attention overlay
- Grad-CAM-style influence areas
- Image quality score
- Image-quality summary

The attention overlay shows where the model output was influenced. It does not prove that a lesion exists in that location.

### Observed indicators

The prototype lists model-generated indicators with:

- Indicator type
- Approximate retinal location
- Relative level such as Low or Moderate

These are not confirmed clinical signs. The clinician must inspect the original image and apply clinical judgment.

### Risk stratification

The report shows a screening risk level and model probability. In the current prototype, the example is **Moderate** with a simulated probability of 91.8%.

Model probability should not be interpreted as a calibrated probability of disease unless calibration has been formally validated.

### Patient summary

The report summarizes:

- Patient identity
- Age and sex
- Screening reason
- Diabetes history
- Image reviewed

Check these details before saving or sharing a report.

### Recommended next step

The prototype recommends ophthalmologist review within an appropriate timeframe. This is a referral suggestion, not a treatment recommendation.

## 7. Clinical Review Rules

A clinician reviewing a case should:

1. Inspect the original retinal image.
2. Compare the image with the model attention map.
3. Consider image quality and patient history.
4. Treat model indicators as supporting evidence only.
5. Confirm or reject the finding using qualified clinical judgment.
6. Record a clinical note and referral decision in the final production system.

## 8. Privacy and Safety

Do not upload patient-identifiable images to an unapproved environment. The current prototype keeps state in the browser and does not provide a production database, authentication system, audit log, or secure medical storage.

Before real-world deployment, the project requires:

- User authentication and role-based access
- Encrypted image and report storage
- Consent and privacy workflows
- Audit logging
- Data-retention controls
- Dataset and model validation
- Clinical safety review
- Applicable regulatory review

## 9. Prototype Limitations

The current website is an interface prototype:

- Model inference is simulated.
- Grad-CAM is a visual demonstration, not generated by a trained model.
- Risk and confidence values are example values.
- The report is not a medical diagnosis.
- The sample images are not suitable for clinical evaluation.
- There is no live PDF export or backend persistence yet.

## 10. Troubleshooting

### The website does not open

Make sure the development server is running:

```bash
npm run dev
```

Then open the URL printed in the terminal.

### The upload button does not show a result

Select an image or click **Use fundus demo** first. The **Run quality check** button appears after an image is selected.

### The website looks outdated after code changes

Refresh the browser or open a fresh tab at:

```text
http://localhost:5173/
```

### The production build fails

Run:

```bash
npm install
npm run lint
npm run build
```

Review the first error reported by the terminal before continuing.

## 11. Intended Production Workflow

The production version should connect the interface to:

```text
Patient record
  -> Secure image upload
  -> Image quality service
  -> Preprocessing service
  -> Validated ML model
  -> Grad-CAM explanation
  -> Screening report
  -> Ophthalmologist review
  -> Controlled feedback dataset
```

No automatic model retraining should occur from an individual clinician correction. Feedback should be reviewed, validated, and evaluated before any new model is approved for deployment.
