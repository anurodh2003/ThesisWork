const express = require('express');
const app = express();
const port = 3000;

const jsModule = require('./users.js');

app.use(express.json());


app.get('/', (req, res) => {
    console.log(jsModule);
    console.log(jsModule.length);
    console.log(jsModule[0].kidneys.length);

    let numKidneys = 0;
    jsModule.forEach(user => {
        if(user.kidneys[0].status === 'healthy'){
            console.log(user.name + "'s kidneys are healthy.");
            numKidneys += user.kidneys.length;
        }
    });

    console.log('Total number of kidneys:', numKidneys,

    );

    res.json({ "totalHealthyKidneys": numKidneys,
      "users": jsModule.filter(user => user.kidneys.every(kidney => kidney.status === 'healthy')).map(user => user.name)
    });
});

app.post('/', (req, res) => {
    const isHealthy = req.body.isHealthy;
    console.log('Received isHealthy:', isHealthy);
    jsModule.forEach(user => {
        user.kidneys.forEach(kidney => {
            kidney.status = isHealthy ? 'healthy' : 'unhealthy';
        });
    });
    res.json({ message: 'Kidney statuses updated successfully.' });
});


app.put('/', (req, res) => {
    const userName = req.body.userName;
    const kidneyType = req.body.kidneyType;
    const newStatus = req.body.newStatus; // 'healthy' or 'unhealthy'

    console.log(`Updating ${userName}'s ${kidneyType} kidney to ${newStatus}`); 
    jsModule.forEach(user => {
        if(user.name === userName){
            user.kidneys.forEach(kidney => {  
                if(kidney.type === kidneyType){
                    kidney.status = newStatus;
                }
            });
        }
    });

    res.json({ message: `${userName}'s ${kidneyType} kidney status updated to ${newStatus}.` });
});

app.delete('/', (req, res) => {
    jsModule.forEach(user => {
        user.kidneys = [];
    });
    res.json({ message: 'All kidneys have been deleted for all users.' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});