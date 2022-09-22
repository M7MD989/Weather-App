// Personal API Key for OpenWeatherMap API
const APIKey = '109c192a79bda1b52c318623bdbdb5a5';
const BaseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';

/* Global Variables */
const zip = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const button = document.getElementById('generate');

// Create a new date instance dynamically with JS
let date = new Date();
let currentDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;

//get weather temprature
async function weatherTemp(BaseUrl,zipCode,APIKey){
    // waiting to fetch the URL first
    const getRequest = await fetch(`${BaseUrl}${zipCode}&appid=${APIKey}&units=imperial`)
    try{
        //getting data in json form
        const newData = await getRequest.json()
        return newData;
    }catch(error){
        console.log(error.message)
        // appropriately handle the error
    }
}

//setting generate button
button.addEventListener('click',function(){
    // if condition to make sure the user entered the data
    if(zip.value.trim() === ''|| feelings.value.trim() === '') {
        alert('zip code and feelings are required')
        return;
    }
    //postind user data then updating the UI with the new info
    weatherTemp(BaseUrl,zip.value,APIKey).then((data) => postToServer({
        date: currentDate,
        temp: data.main.temp,
        feelings: feelings.value,
    }))
    .then(() => updateUI());
});

// send user data
async function postToServer(data = {}){
    //setting post credentails
        const postRequest = await fetch('/data/post',{
            method:'POST',
            credentials:'same-origin',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
        })
    //return it in json form
    try{
        const newData = await postRequest.json()
        return newData
    }catch(error){
        console.log(error.message)
        // appropriately handle the error
    }
}

// update user UI
const updateUI = async () =>{
    const getRequest = await fetch('/data/get');
    try {
    // Transform into JSON
    const newData = await getRequest.json()
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML = Math.round(newData.temp)+ ' degrees';
    document.getElementById('content').innerHTML = newData.feelings;
    document.getElementById('date').innerHTML = newData.date;
    }catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
   }