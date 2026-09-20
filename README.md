# Drishti-XAI

Explainable AI-based diabetic retinopathy screening for rural and resource-constrained healthcare environments.

## Overview

Drishti-XAI is a screening workflow for analyzing retinal fundus images. The project is designed to help healthcare workers identify potentially high-risk diabetic retinopathy cases and refer them to an ophthalmologist in time.

The planned system combines:

- Retinal fundus image upload or capture
- Image quality checks and preprocessing
- Lightweight deep learning for diabetic retinopathy screening
- Grad-CAM explainability heatmaps
- Confidence and referral suggestions
- Clinician review and reporting
- Future offline and edge-device inference

The current repository contains a presentation-ready React prototype of the screening experience. It demonstrates the user workflow and a simulated analysis result; it does not yet contain a trained medical model or a production backend.

## Current Prototype

The current application supports:

1. Healthcare worker screening workspace
2. Patient context and screening notes
3. JPG, PNG, and SVG fundus image selection
4. Drag-and-drop image upload
5. Included synthetic demo fundus image
6. Selectable sample image gallery with two external eye references
7. Local analysis loading state
8. Simulated DR result with confidence score
9. Grad-CAM-style attention visualization
10. Structured findings with anatomical location and severity
11. Image quality score and model metadata
12. Moderate-risk stratification and referral guidance
13. Patient summary and clinician review handoff
14. Clinical decision-support disclaimer
15. Functional Overview, Patients, Screening, Review queue, and Reports views
16. Patient directory with screening status and case navigation
17. Responsive desktop and mobile layouts

The current result is intentionally simulated so the interface can be demonstrated before the ML service is connected.

## Technology Stack

### Implemented

- React 19
- Vite 8
- JavaScript and JSX
- CSS
- Oxlint
- Local browser state for the prototype workflow

### Planned production stack

- Python
- PyTorch or TensorFlow/Keras
- EfficientNet-B0 or MobileNet for transfer learning
- OpenCV and Pillow for image processing
- Grad-CAM for explainability
- FastAPI for the inference API
- PostgreSQL for users, patients, screenings, and audit records
- ReportLab for PDF screening reports
- TensorFlow Lite or ONNX Runtime for edge inference
- Docker for repeatable deployment

## Architecture

```text
Healthcare worker
        |
        v
React screening dashboard
        |
        v
FastAPI service                     Planned
        |
        +--> Image quality and preprocessing
        |
        +--> EfficientNet/MobileNet inference
        |          |
        |          +--> DR prediction
        |          +--> Confidence score
        |
        +--> Grad-CAM explanation
        |
        +--> Screening result and referral suggestion
        |
        +--> PostgreSQL and report storage
        |
        v
Ophthalmologist review and controlled feedback
```

## Screening Workflow

```text
Patient registration
        |
        v
Fundus image capture or upload
        |
        v
Image quality check
        |
        +--> Poor quality: request recapture
        |
        v
Preprocessing and optimization
        |
        v
Deep learning inference
        |
        +--> Prediction and confidence
        +--> Grad-CAM heatmap
        |
        v
Screening result
        |
        v
Clinician review and referral decision
```

## Project Structure

```text
drishti-xai/
├── public/
│   └── sample-fundus.svg       # Synthetic demo image
├── src/
│   ├── App.jsx                 # Screening workflow and prototype state
│   ├── App.css                 # Application visual system
│   ├── index.css               # Global styles
│   └── main.jsx                # React entry point
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm

Check your installation:

```bash
node --version
npm --version
```

## Installation

From the project root:

```bash
npm install
```

## Run Locally

Start the Vite development server:

```bash
npm run dev
```

Open the URL shown in the terminal, normally:

```text
http://localhost:5173/
```

If the port is already in use, Vite will choose another available port.

## Demonstrate the Prototype

1. Open the local URL.
2. Click **Use demo scan**, or select `public/sample-fundus.svg` from the upload control.
3. Click **Run quality check**.
4. Wait for the simulated analysis state.
5. Review the prediction, confidence, attention visualization, and referral suggestion.
6. Use **New screening** to return to the upload workflow.

The included SVG is synthetic and exists only for interface demonstration. The two external eye photographs are reference images hosted by Unsplash; ordinary external-eye photographs are not suitable for diabetic-retinopathy screening or model evaluation. Use a licensed fundus dataset for clinical ML work.

## Available Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run Oxlint
```

## Deploy to GitHub Pages

The repository includes an automated workflow at `.github/workflows/deploy-pages.yml`.

The configured repository is [Sharad1707/dristi-x](https://github.com/Sharad1707/dristi-x).

From the project root, connect and push the project:

```bash
git init
git add .
git commit -m "Initial Drishti-XAI prototype"
git branch -M main
git remote add origin https://github.com/Sharad1707/dristi-x.git
git push -u origin main
```

Then open **Settings > Pages** in GitHub and set the source to **GitHub Actions**. After the workflow completes, GitHub will show the public Pages URL.

The Vite configuration uses relative asset paths so the site works from a GitHub Pages project URL.

## User Manual

For step-by-step instructions for healthcare workers, reviewers, and administrators, see [USER_MANUAL.md](USER_MANUAL.md).

## Planned ML Implementation

The next implementation phase should replace the simulated result with a real inference service:

1. Obtain and document a licensed retinal dataset such as IDRiD or APTOS.
2. Start with binary classification: no DR versus requires attention.
3. Split data by patient where possible to prevent leakage.
4. Resize, normalize, and quality-check fundus images.
5. Fine-tune EfficientNet-B0 using transfer learning.
6. Track recall, specificity, precision, F1 score, ROC-AUC, and confusion matrix.
7. Prioritize sensitivity because false negatives are especially important in screening.
8. Add Grad-CAM using the final convolutional feature layer.
9. Validate heatmaps against lesion annotations where available.
10. Export the approved model for local or edge inference.

## Planned API Boundary

The frontend can later connect to endpoints such as:

```text
POST /api/v1/screenings/analyze
GET  /api/v1/screenings/{screening_id}
GET  /api/v1/screenings/{screening_id}/heatmap
GET  /api/v1/reports/{screening_id}
POST /api/v1/screenings/{screening_id}/review
```

An analysis response could contain:

```json
{
  "prediction": "DR_DETECTED",
  "confidence": 0.918,
  "recommendation": "REFER_FOR_CLINICAL_REVIEW",
  "heatmap_url": "/api/v1/screenings/2048/heatmap",
  "model_version": "drishti-model-v1"
}
```

## Medical Safety and Scope

Drishti-XAI is intended as an AI-assisted screening and decision-support tool. It is not a replacement for an ophthalmologist and must not be presented as an autonomous diagnostic or treatment system.

Important limitations include:

- The current UI uses simulated inference.
- A synthetic image is not suitable for clinical validation.
- Model confidence is not automatically a calibrated medical probability.
- Grad-CAM shows influential regions but does not prove clinical causality.
- Dataset bias and image quality can affect model performance.
- Clinical deployment requires extensive validation, privacy controls, auditability, and regulatory review.

## Contribution Direction

Keep changes focused on one of these layers:

- Frontend screening workflow
- Image preprocessing and quality checks
- Model training and evaluation
- Explainability and heatmap validation
- API and persistence
- Clinical review, reporting, and auditability

Before adding a production claim to the interface, connect it to a measured implementation and document the supporting evaluation.

## License and Dataset Notice

This repository currently does not define a software license. Add one before public distribution.

Any clinical dataset must be downloaded from its official source and used according to its license, terms of access, and privacy requirements. Do not commit patient-identifiable images or health information to this repository.
