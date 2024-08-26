# Three.js Playground Web App

**Author:** Israel Suarez Robles  
**Live Demo (Registration is disabled, log in with pre-filled credentials):**<br>
[three-playground.infinityfreeapp.com](http://three-playground.infinityfreeapp.com)<br>
**Local Demo:** For local deployment, read Docker instructions below.

**Completion Date:** June 18, 2019<br>
**Note:** This application has not been updated since its initial completion, some functions have been deprecated.

## Overview

Originally developed as the software component of my bachelor’s degree capstone project in Mechatronics Engineering, the
Three.js Playground Web App is a fully-functional online tool for creating, manipulating, and storing basic 3D models 
from base solids directly within the browser. The app supports exporting models in multiple formats, including .stl and .obj.

This application served as a practical demonstration of software and hardware integration for my capstone project. This 
app provides a processing tool to export models compatible with a custom-built 3-axis wood CNC machine,
which was the second component of my project. While the CNC integration was tailored to my project, the app is intended
as a reference tool and is not designed for users to build their own CNC machines.

## Features

- **3D Model Creation:** Users can create, manipulate, and export 3D models in multiple formats.
- **Interactive 3D Environment:** The app provides a rich set of tools for designing and editing 3D scenes, including
  adding/removing objects and modifying object properties.
- **User Interaction:** Full mouse and keyboard controls allow users to interact with 3D objects and scenes seamlessly.
- **Account Integration:** Users can save and load their 3D models directly from their accounts.
- **Deployment:** The application was deployed using Three.js, PHP, MySQL, and other web technologies.

## Technical Stack

- **Frontend:** Three.js, JavaScript, jQuery, AJAX
- **Backend:** PHP and MySQL
- **Additional skills required:** SolidWorks, 3D printing, microcontrollers, proximity sensor and stepper motors integration

## Running the Application in a Docker Container

If you'd like to run the Three.js Playground Web App in a Docker container, follow these steps:

Prerequisites: Ensure you have Docker and Docker Compose installed on your machine.

1. **Clone the Repository:**
   git clone https://github.com/oakisr/ThreePlayground.git
2. **Navigate to the Project Directory:**
   cd ThreePlayground
3. **Build and run the Docker containers:**
   docker-compose up --build   
4. **Access the Application:**
   Open your browser and navigate to http://localhost:8080
