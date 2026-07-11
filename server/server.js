const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
   const contactRouter = require('./routes/contact');
   const experiencesRouter = require('./routes/experience');
   const certificationsRouter = require('./routes/certification');
   const projectsRouter = require('./routes/projects');
   const authRouter = require('./routes/auth');


const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'), { extensions: ['html'] }));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err=> console.log('Error connecting to MongoDB:', err));
    
    app.use('/api/projects', projectsRouter);
    
    app.use('/api/certifications', certificationsRouter);
   
    app.use('/api/experiences', experiencesRouter);
 
    app.use('/api/contact', contactRouter);

    app.use('/api/auth', authRouter);



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});