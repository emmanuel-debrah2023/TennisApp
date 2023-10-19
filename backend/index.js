import bodyparser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 4000;

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://shuAssignment:3xw7P0MlbNphaD79@cluster0.1dvskl9.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.get('/', (req,res) =>
  res.send('Our Tennis application is running!')
);

app.listen(port, () =>
  console.log(`Your soccer server is running on server ${port}`)
)