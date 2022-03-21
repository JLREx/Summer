# Summer

A simple summarization tool developed in collaboration with [@chinhong11](https://github.com/chinhong11), [@ChunKeatTan](https://github.com/ChunKeatTan), and [@yuanqinong](https://github.com/yuanqinong) for subject TNL3221 Natural Language Processing

## Summer User Manual

1. Download the ZIP of this repository and extract the zipped folder to Summer. 

### Backend Django Server Installation

1. Open the Summer-Backend folder with Visual Studio Code. 
2. Make sure you have Python < 3.10 installed on your computer. If you do not have Python installed on your computer, we recommend getting Python 3.9.10 from [here](https://www.python.org/downloads/release/python-3910/). 
3. Run command `python -m venv env-name`, where `env-name` can be any name for your Python environment. 
4. Activate the environment by creating a new `Command Prompt` terminal. You can make sure your environment is activated by observing the `(env-name)` at the terminal. 
5. Run command `pip install -r requirements.txt` to install all dependencies for the server backend. This could take up to 10 minutes depending on your network condition. 
6. Navigate to the summer folder in the Summer-Backend folder with `cd summer`. 
7. Open `views.py` in `summarization` folder, replace the model path with your model path. 
8. Start the Django server with command `python manage.py runserver`. 

### Frontend Guide

The Summer webpage can be launched with two ways. 

1. ***(Recommended)*** Open the Summer-Frontend folder with Visual Studio Code and start the live server for the Summer webpage frontend. The Live Server extension can be installed in Visual Studio Code. 
2. Navigate to the Summer-Frontend folder and open the `index.html` file directly from the file explorer. 

### Extension Installation
The Summer extension is a simplified version of the Summer webpage, providing only the summarization function for users' browsing sessions. 

1. On your chromium-based browser, open the `Manage Extensions` page. 
2. Enable `Developer mode`, then select `Load unpacked` and select the Summer-Extension folder. *Remember to switch off `Developer mode` after this step.*