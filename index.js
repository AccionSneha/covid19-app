const app = require('./config/express');
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.info(`Server listening on port ${port}`);
});

module.exports = app;