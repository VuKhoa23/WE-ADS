## Email Controller Instruction

This middleware is used for sending verification emails.\
Select an email as sender(should be Gmail), create an app password for that email and copy it. If you don't know how to create an app password, click [here](https://support.google.com/mail/answer/185833?hl=en). Then, go to .env and specify:
- EMAIL_HOST: smtp.gmail.com
- EMAIL_SUPPORT: support email of the website
- EMAIL_PORT: 587 or 465. Read more at: [https://sendgrid.com/en-us/blog/whats-the-difference-between-ports-465-and-587](https://sendgrid.com/en-us/blog/whats-the-difference-between-ports-465-and-587)
- EMAIL_ADDRESS: the email that you have just created an app password. This is the email from where you send verification emails to users 
- EMAIL_PASSWORD: the app password you have just created
- EMAIL_EXPIRE_TIME: expire time of the code in the email

### The usage of this middleware has not been implemented
