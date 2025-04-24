<h1 align="center">AgentBlazer Hack36</h1>
<p align="center">
</p>

<a href="https://hack36.com"> <img src="https://postimage.me/images/2025/04/19/built-at-hack36.png" height=24px> </a>


## Introduction:
SUSHRUT is an intelligent, conversational healthcare assistant aimed at revolutionizing medical access through personalized recommendations and AI-powered interactions. The project, developed for Hack36 2025, focuses on making healthcare inclusive, efficient, and secure, especially for visually and motor-impaired individuals, people with less medical domain knowledge and also aims to eliminate the regional language barrier.
  
## Demo Video Link:
  <a href="https://youtu.be/71LMB9iWDOs">Link to Demo Video</a>
  
## Presentation Link:
  <a href="https://mnnitedu-my.sharepoint.com/:p:/g/personal/aviral_20225017_mnnit_ac_in/EXHky5RqMJVEjeci-eijiMEBqsO5i-dmDO7DCwvru2mQWg?e=PHj3ua"> PPT link here </a>
  
  
## Table of Contents:
  **Doctor Recommendation**  
  Suggests doctors based on patient symptoms using a dynamic agent developed using JulepAI (running on Claude-3.5-sonnet).

 **Conversational Interface**  
  Voice-enabled interactions for accessibility with a vision for wake-up powered activations.

 **Touchless Authentication**  
  Innovative multimodal (voice + face) auth system using deep learning models (`wav2vec2`, `Facenet_TL`,`minivisionAI spoofing model`) to authenticate without typing. Aimed at people who can't type, making the platform accessible to people who do not wish to share their passwords with the helper and get authenticated without assistance [Detailed descriptions in the code AI_Service and presentation]
 
 **Medical History & Pathology Reports**  
  Summarizes the third-party pathology reports, making the information accessible to those who do not have access to medical domain knowledge. Uses parsers, NER models, summarizer tools and regex before sending to the Gemini for processing.

  **Masking PII**
  The personally identifiable information is the data which must be protected at all costs, so the data which is sent to the external LLMs including Julep (which lacks zero-retention policy or masking layer) can be masked and then later demasked [For examples visit the module in github and see comments]


 **Appointment Management**  
  Backend-integrated appointment booking using Spring Boot and Google Text Translation APIs.
## Technology Stack:
  1) SpringBoot
  2) Python
  3) FastAPI
  4) Postgres SQL
  5) React.js
  6) Tensorflow
  7) Julep
  

## Contributors:

Team Name: AgentBlazer

* [Aviral Mishra](https://github.com/aviral-mishra-1008)
* [Ayushman Tiwari](https://github.com/Ayushman444)
* [Vaibhav Sharma](https://github.com/IWantToBeVS)
* [Mangal Gupta](https://github.com/mangalgithub)


### Made at:
<a href="https://hack36.com"> <img src="https://postimage.me/images/2025/04/19/built-at-hack36.png" height=24px> </a>
