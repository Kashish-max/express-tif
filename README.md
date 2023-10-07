# Node.js + Express.js APIs
## User stories
- Module: Authentication
 - Feature: User should be able to signup using valid name, email and strong password.
 - Feature: User should be able to signin using valid credentials.
- Module: Community
 - Feature: User should be able to see all communities.
 - Feature: User should be able to create a community.
- Module: Moderation
 - Feature: User should be able to see all community members.
 - Feature: User should be able to add a user as member.
 - Feature: User should be able to remove a member from community.

## Tech Stack 
- Language: Node v18
- Database: MongoDB
- ORM: Mongoose
- Library: @theinternetfolks/snowflake is used to generate unique IDs instead of MongoDB ObjectID

### All APis are working for all **_Successful_** and **_Error_** examples.

## Models Architecture
![Models Architecture](https://i.postimg.cc/yYxqP7P7/Hiring-Assignment.png)

### **_Session Authentication with cookies is used. No need to pass additional authorization headers with the protected requests._**

### Deployment
The app is deployed at vercel:
[Website Deployment Link](https://express-tif.vercel.app/)

### Installation

1. Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/Kashish-max/express-tif.git
   ```

2. Navigate to the project directory:

   ```bash
   cd express-tif/
   ```

3. Install the dependencies using either npm or yarn:

   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn
   ```

4. Setup environment variables(.env file) in root directory of backend:

   ```bash
    DB_URI=<YOUR_MONGO_DB_URI>
   ```

### Running the App Locally

Once you have installed the dependencies, you can run this app on your local machine. Follow these steps:

1. Start the development server:

   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev
   ```

2. You can make API requests to `http://localhost:3000` to see the app in action.