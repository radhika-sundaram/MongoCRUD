const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');


const app=express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}   
));
const FoodModel=require('./models/Food');
mongoose.connect('mongodb+srv://admin:admin@cluster0.pqksyap.mongodb.net/?appName=Cluster0/food', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

app.post('/insert', async (req, res) => {
    console.log("BODY:", req.body); // 👈 add

    const { foodName, description } = req.body;

    const food = new FoodModel({ foodName, description });

    try {
        await food.save();
        console.log("SAVED"); // 👈 add
        res.send('Data Inserted');
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send('Error inserting data');
    }
});


//Read the data
app.get("/read",async(req,res)=>{
    try{
        const food=await FoodModel.find();
        res.send(food)
    }
    catch(err)
    {
         res.send("Error")
    }
})

//Updating the data

app.put("/update",async(req,res)=>{
    const {newFoodName,id}=req.body;
    try{
         const updateFood=await FoodModel.findById(id);
         if(!updateFood)
         {
          return res.status(404).send("Data not found")
         }
         updateFood.foodName=newFoodName;
         await updateFood.save()
         res.send("Data updated successfully")
      }
      catch(err)
      {
        console.log(err)
      }
  })

  //Deleting the data
  app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id; 
    try{
      const result=await FoodModel.findByIdAndDelete(id);
      if(!result)
      {
         return res.status(404).send("Food items not found")
      }
      res.send("Food item deleted successfully")
    }catch(err){
          console.error(err);
          res.status(500).send("Error deleting food item")
      }
    });
  

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});