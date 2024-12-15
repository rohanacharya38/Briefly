# Sample Javascript/React/Node

This application is your intelligent research companion. Here you can upload papers, get summaries, and find answers instantly to relevant questions of the paper.

## 🚀 Getting Started  

### Open Using Daytona  

1. **Install Daytona**: Follow the [Daytona installation guide](https://www.daytona.io/docs/installation/installation/). 
    
2. **Create the Workspace**:  
   ```bash  
   daytona create git@github.com:rohanacharya38/Briefly.git 
   ```  

3. **Forward port 5001**
   
4. **Start the Application**:
  - Navigate to client:  
   ```bash  
   cd client
   npm run dev
   ```  
  - Navigate to server:
   ```bash  
   cd backend
   node app.js
   ``` 

## Problems Encountered

- **Model Loading Delays**: One of the major issues faced was the delay in loading large language models, especially during high traffic. The translation feature depends on external inference APIs, which can occasionally result in slower response times or errors when models are still loading.

- **Translation Accuracy**: While the multilingual system offers extensive support, the quality of translation for certain technical terms or domain-specific content may vary, potentially affecting the precision of translated research papers.

- **Retry Mechanism**: To mitigate the loading delays, a retry mechanism with exponential backoff was implemented. This ensures that the translation request is retried up to three times, with increasing delay intervals between attempts.

## Problem Statement

- Time-Consuming Research: Researchers and students often spend extensive time reading and understanding lengthy academic papers.

- Information Overload: Processing and retaining vast amounts of information from multiple research papers can be overwhelming.

- Difficulty in Extracting Key Insights: Identifying and focusing on the most critical information within a paper is challenging without a summarization tool.

- Limited Access to Expert Answers: Finding precise and detailed answers to specific questions about research papers can be difficult without expert guidance.

## Solutions

- Automated Summarization: The tool generates concise summaries of research papers, saving users time and effort in understanding key points.

- Streamlined Information Processing: By condensing information, the tool helps users manage and retain knowledge from multiple papers more effectively.

- Focused Insights Extraction: The application highlights the most critical information, allowing users to quickly grasp important insights without extensive reading.

- Expert-Level Q&A: The system answers specific questions about research papers with detailed explanations, providing users with expert-level guidance and understanding.