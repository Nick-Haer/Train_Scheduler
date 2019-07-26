


  let firebaseConfig = {
    apiKey: "AIzaSyAZYWHv3LqZHcjj6ZgrnQFiIX9d--foyiw",
    authDomain: "fir-sandbox-b6cde.firebaseapp.com",
    databaseURL: "https://fir-sandbox-b6cde.firebaseio.com",
    projectId: "fir-sandbox-b6cde",
    storageBucket: "",
    messagingSenderId: "1059956870565",
    appId: "1:1059956870565:web:3af160bda0e48718"
  };

  firebase.initializeApp(firebaseConfig);



let database = firebase.database()


$("#submit").on("click", function () {
    event.preventDefault();
    console.log("hi")
   let trainName = $(`#name`).val().trim()
   let destination = $(`#destination`).val().trim()
   let firstArrivalTime = $(`#time`).val().trim()
   let frequency = $(`#frequency`).val().trim()

   database.ref().push({
       name: trainName,
       trainDestination: destination,
       firstArrival: firstArrivalTime,  
       tripfrequency: frequency,
   })

})

database.ref().on(`child_added`, function(snapshot) {
    console.log(snapshot.val().name)
    let newRow = $(`<tr>`)
    //finding the difference between the first arrival time, converted with moment.js, and the current time, in minutes.
    let timeLapsed = moment().diff(moment((snapshot.val().firstArrival), "HH:mm"), "minutes")

    let minutesAway;

    let nextArrival;
    // if the arrival is in the future, then set the apporpriate times.
    // Otherwise, if the arrival is in the past, calculate how many minutes there are between the last multiple of frequency after the arrival time and the curren time, then subtract that number from frequency to find how long it will be till the train next arrives. Add that to current time to get the next arrival time.
    if (Math.sign(timeLapsed) === -1) {
        nextArrival = snapshot.val().firstArrival
        minutesAway = Math.abs(timeLapsed)
    } else {
        minutesAway = snapshot.val().tripfrequency - (timeLapsed % snapshot.val().tripfrequency)
        nextArrival = moment().add(minutesAway, "minutes").format("HH:mm")
    }

    $(`<td> ${snapshot.val().name}</td>`).appendTo(newRow)
    $(`<td> ${snapshot.val().trainDestination}</td>`).appendTo(newRow)
    $(`<td> ${snapshot.val().tripfrequency}</td>`).appendTo(newRow)
    $(`<td> ${nextArrival}</td>`).appendTo(newRow)
    $(`<td> ${minutesAway}</td>`).appendTo(newRow)

    newRow.prependTo($("#displaytrains"))
})
