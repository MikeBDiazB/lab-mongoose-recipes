// index.js
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');
require('dotenv').config();  // Make sure to use environment variables for sensitive data

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/recipes'; // Use the .env or default URI

mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    console.log(`Connected to the database: "${x.connection.name}"`);

    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Add a new recipe
    const newRecipe = {
      title: 'Thai Style Chicken Noodle Soup',
      level: 'Easy Peasy',
      ingredients: ['chicken', 'noodles', 'broth', 'lime', 'ginger'],
      cuisine: 'Thai',
      dishType: 'soup',
      duration: 30,
      creator: 'Chef Thai',
    };

    return Recipe.create(newRecipe);
  })
  .then((createdRecipe) => {
    console.log(`Recipe created: ${createdRecipe.title}`);
    
    // Insert multiple recipes from data.json
    const recipes = require('./data.json');
    return Recipe.insertMany(recipes);
  })
  .then((insertedRecipes) => {
    insertedRecipes.forEach((recipe) => {
      console.log(`Recipe inserted: ${recipe.title}`);
    });
    
    // Update the duration of a specific recipe
    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true } // Return the updated recipe
    );
  })
  .then((updatedRecipe) => {
    console.log(`Updated recipe: ${updatedRecipe.title} - New duration: ${updatedRecipe.duration}`);

    // Remove a recipe (Carrot Cake)
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    console.log('Carrot Cake removed from the database!');

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  })
  .catch((err) => {
    console.log('Error:', err);
    mongoose.connection.close();
  });

